import { getEnv, env as envObj, isDev } from '../utils/env';

/**
 * Lightweight HTTP client using fetch with:
 * - Base URL from REACT_APP_API_BASE or REACT_APP_BACKEND_URL
 * - credentials: 'include' for cookie-based auth
 * - JSON convenience and 401 event emission for login flow
 */

// Resolve API base
const API_BASE = (getEnv?.('REACT_APP_API_BASE') || getEnv?.('REACT_APP_BACKEND_URL') || envObj?.API_BASE || '')
  .toString()
  .replace(/\/+$/, '');

// Simple pub/sub for auth events so UI can react if needed
const listeners = new Set();

// PUBLIC_INTERFACE
export function onAuthEvent(callback) {
  /** Subscribe to auth-related events like 'unauthorized'.
   * Returns an unsubscribe function.
   */
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emit(event, payload) {
  listeners.forEach((cb) => {
    try {
      cb(event, payload);
    } catch (_e) {
      // noop
    }
  });
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      emit('unauthorized', { path, options });
    }
    const contentType = response.headers.get('content-type') || '';
    let errorPayload;
    try {
      errorPayload = contentType.includes('application/json') ? await response.json() : await response.text();
    } catch (_e) {
      errorPayload = `HTTP error ${response.status}`;
    }
    if (isDev?.()) {
      // eslint-disable-next-line no-console
      console.warn('[http][error]', response.status, errorPayload);
    }
    const err = new Error(
      typeof errorPayload === 'string' ? errorPayload : errorPayload?.message || `HTTP error ${response.status}`
    );
    err.status = response.status;
    err.payload = errorPayload;
    throw err;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

const httpClient = {
  // PUBLIC_INTERFACE
  get: (path, options = {}) => request(path, { method: 'GET', ...options }),
  // PUBLIC_INTERFACE
  post: (path, body, options = {}) =>
    request(path, { method: 'POST', body: body != null ? JSON.stringify(body) : undefined, ...options }),
  // PUBLIC_INTERFACE
  put: (path, body, options = {}) =>
    request(path, { method: 'PUT', body: body != null ? JSON.stringify(body) : undefined, ...options }),
  // PUBLIC_INTERFACE
  delete: (path, options = {}) => request(path, { method: 'DELETE', ...options }),
};

export default httpClient;
