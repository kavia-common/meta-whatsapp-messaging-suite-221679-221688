/**
 * WebSocket client with auto-reconnect, heartbeat, and event dispatch.
 * This hardened client integrates with REACT_APP_WS_URL and exposes helpers to create
 * a singleton client from environment. Includes robust error handling and teardown.
 */

import { getEnv, isProd } from "../utils/env";

/**
 * Lightweight event emitter to avoid external deps.
 */
class Emitter {
  constructor() {
    this.listeners = new Map();
  }
  on(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(cb);
    return () => this.off(event, cb);
  }
  off(event, cb) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(cb);
      if (set.size === 0) this.listeners.delete(event);
    }
  }
  emit(event, payload) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(payload);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Emitter listener error", e);
        }
      });
    }
  }
}

/**
 * Options for the WebSocket client
 * - protocols: optional subprotocols
 * - heartbeatInterval: ms between pings
 * - heartbeatTimeout: ms to wait for pong before reconnect
 * - maxReconnectDelay: maximum backoff ms
 * - logErrors: log to console errors in non-prod
 */
const DEFAULTS = {
  protocols: undefined,
  heartbeatInterval: 15000,
  heartbeatTimeout: 10000,
  maxReconnectDelay: 30000,
  logErrors: true,
};

/**
 * PUBLIC_INTERFACE
 * Create a shared WebSocket client instance that auto-reconnects and dispatches messages.
 * The client multiplexes messages using a "type" field and emits events by type.
 */
export class WSClient {
  /** @param {string} url ws(s):// URL
   *  @param {Partial<typeof DEFAULTS>} options */
  constructor(url, options = {}) {
    /** This is a public class that manages a resilient WebSocket connection. */
    if (!/^wss?:\/\//i.test(String(url || ""))) {
      throw new Error("Invalid WebSocket URL. Expected ws:// or wss://");
    }
    this.url = url;
    this.opts = { ...DEFAULTS, ...options };
    this.ws = null;
    this.emitter = new Emitter();
    this.statusEmitter = new Emitter(); // connects, disconnects, retries, errors
    this.connected = false;
    this._reconnectAttempts = 0;
    this._heartbeatTimer = null;
    this._heartbeatTimeoutTimer = null;
    this._manualClose = false;
    this._connect();
  }

  /**
   * PUBLIC_INTERFACE
   * Subscribe to message events by type.
   * @param {string} type message.type to listen for
   * @param {(payload:any)=>void} cb callback
   * @returns {() => void} unsubscribe function
   */
  on(type, cb) {
    return this.emitter.on(type, cb);
  }

  /**
   * PUBLIC_INTERFACE
   * Subscribe to connection status events: "open" | "close" | "retry" | "error"
   */
  onStatus(event, cb) {
    return this.statusEmitter.on(event, cb);
  }

  /**
   * PUBLIC_INTERFACE
   * Send a message (object) through the socket. Adds "client_ts" by default.
   * Returns false when socket is not open.
   */
  send(obj) {
    const payload = { client_ts: Date.now(), ...obj };
    let raw;
    try {
      raw = JSON.stringify(payload);
    } catch (e) {
      if (this.opts.logErrors && !isProd()) {
        // eslint-disable-next-line no-console
        console.warn("WSClient: failed to stringify payload", e);
      }
      return false;
    }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(raw);
        return true;
      } catch (e) {
        if (this.opts.logErrors && !isProd()) {
          // eslint-disable-next-line no-console
          console.warn("WSClient: send failed", e);
        }
      }
    }
    return false;
  }

  /**
   * PUBLIC_INTERFACE
   * Gracefully close the socket and stop reconnecting.
   */
  close() {
    this._manualClose = true;
    this._clearHeartbeat();
    if (this.ws) {
      try {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        this.ws.close(1000, "client closing");
      } catch (e) {
        // ignore
      }
    }
    this.ws = null;
  }

  _connect() {
    try {
      this.ws = new WebSocket(this.url, this.opts.protocols);
    } catch (e) {
      this._scheduleReconnect();
      this.statusEmitter.emit("error", e);
      if (this.opts.logErrors && !isProd()) {
        // eslint-disable-next-line no-console
        console.error("WSClient: construct WebSocket failed", e);
      }
      return;
    }

    this.ws.onopen = () => {
      this.connected = true;
      this._reconnectAttempts = 0;
      this.statusEmitter.emit("open");
      this._startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      this._handleMessage(event);
    };

    this.ws.onerror = (err) => {
      this.statusEmitter.emit("error", err);
      if (this.opts.logErrors && !isProd()) {
        // eslint-disable-next-line no-console
        console.error("WSClient: socket error", err);
      }
      // Some browsers emit onerror then onclose; reconnect in onclose.
    };

    this.ws.onclose = () => {
      const wasConnected = this.connected;
      this.connected = false;
      this._clearHeartbeat();
      this.statusEmitter.emit("close");
      if (!this._manualClose) {
        // Only schedule reconnect if not manually closed
        if (wasConnected) {
          // small delay after a successful connection closed
          setTimeout(() => this._scheduleReconnect(), 250);
        } else {
          this._scheduleReconnect();
        }
      }
    };
  }

  _scheduleReconnect() {
    if (this._manualClose) return;
    const attempt = ++this._reconnectAttempts;
    const base = Math.min(this.opts.maxReconnectDelay, 1000 * 2 ** Math.min(attempt, 6)); // capped exponential backoff
    // jitter
    const jitter = Math.floor(Math.random() * 500);
    const delay = base + jitter;
    this.statusEmitter.emit("retry", { attempt, delay });
    setTimeout(() => {
      if (!this._manualClose) this._connect();
    }, delay);
  }

  _startHeartbeat() {
    this._clearHeartbeat();
    // send ping every heartbeatInterval, expect pong within heartbeatTimeout
    this._heartbeatTimer = setInterval(() => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
      try {
        this.ws.send(JSON.stringify({ type: "ping", ts: Date.now() }));
      } catch (e) {
        // ignore send errors, onclose will handle
      }
      if (this._heartbeatTimeoutTimer) clearTimeout(this._heartbeatTimeoutTimer);
      this._heartbeatTimeoutTimer = setTimeout(() => {
        // did not receive pong in time => force reconnect
        try {
          if (this.ws) this.ws.close(4000, "heartbeat timeout");
        } catch (e) {
          // ignore
        }
      }, this.opts.heartbeatTimeout);
    }, this.opts.heartbeatInterval);
  }

  _clearHeartbeat() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
    }
    if (this._heartbeatTimeoutTimer) {
      clearTimeout(this._heartbeatTimeoutTimer);
      this._heartbeatTimeoutTimer = null;
    }
  }

  _handleMessage(event) {
    let data = null;
    try {
      data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    } catch (e) {
      if (this.opts.logErrors && !isProd()) {
        // eslint-disable-next-line no-console
        console.warn("WSClient: message parse error", e, event?.data);
      }
      return;
    }

    // Respond to pongs for heartbeat
    if (data && data.type === "pong") {
      if (this._heartbeatTimeoutTimer) {
        clearTimeout(this._heartbeatTimeoutTimer);
        this._heartbeatTimeoutTimer = null;
      }
      return;
    }

    // Dispatch by "type"; fallback to raw
    if (data && data.type) {
      this.emitter.emit(data.type, data);
    } else {
      this.emitter.emit("message", data);
    }
  }
}

/**
 * PUBLIC_INTERFACE
 * Get or create a singleton WSClient for a given URL.
 * Ensures only one connection per URL across the app.
 */
const clientsByUrl = new Map();
export function getWSClient(url, options) {
  /** This is a public function that returns a shared instance per URL. */
  if (!url) throw new Error("WebSocket URL is required");
  const key = JSON.stringify([url, options && options.protocols]);
  if (!clientsByUrl.has(key)) {
    clientsByUrl.set(key, new WSClient(url, options));
  }
  return clientsByUrl.get(key);
}

/**
 * PUBLIC_INTERFACE
 * Get or create a singleton WSClient using REACT_APP_WS_URL.
 * Returns null when REACT_APP_WS_URL is not configured.
 */
export function getWSClientFromEnv(options) {
  const { REACT_APP_WS_URL } = getEnv();
  if (!REACT_APP_WS_URL) return null;
  try {
    return getWSClient(REACT_APP_WS_URL, options);
  } catch (e) {
    if (!isProd()) {
      // eslint-disable-next-line no-console
      console.warn("WSClientFromEnv: invalid REACT_APP_WS_URL", e);
    }
    return null;
  }
}
