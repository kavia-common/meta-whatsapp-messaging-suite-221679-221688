import { env as envObj, isDev } from '../utils/env';

/**
 * Lightweight HTTP client using fetch with:
 * - Base URL from REACT_APP_API_BASE or REACT_APP_BACKEND_URL
 * - credentials: 'include' for cookie-based auth
 * - JSON convenience and 401 event emission for login flow
 * - Error normalization: { status, code, message, details }
 * - Logging respects REACT_APP_LOG_LEVEL
 */

// Determine logging level helpers
const LOG_LEVEL = (envObj?.LOG_LEVEL || 'debug').toLowerCase();
const allowDebug = ['debug', 'trace'].includes(LOG_LEVEL);
const allowInfo = allowDebug || ['info'].includes(LOG_LEVEL);
const allowWarn = allowInfo || ['warn'].includes(LOG_LEVEL);

// Resolve API base, prefer explicit API_BASE then fallback to '/'
const API_BASE = (envObj?.API_BASE || '').toString().replace(/\/+$/, '');

// Simple pub/sub for auth events so UI (e.g., AuthGuard) can react to 401
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

// Normalize error shape from fetch Response and server payload
function normalizeError(status, payload, fallbackMsg = '') {
  const norm = {
    status: typeof status === 'number' ? status : 0,
    code: undefined,
    message: '',
    details: undefined,
    raw: payload,
  };

  if (payload && typeof payload === 'object') {
    norm.code = payload.code || payload.error || undefined;
    norm.message = payload.message || payload.error_description || fallbackMsg || `HTTP error ${status}`;
    norm.details = payload.details || payload.errors || undefined;
  } else if (typeof payload === 'string') {
    norm.message = payload || fallbackMsg || `HTTP error ${status}`;
  } else {
    norm.message = fallbackMsg || `HTTP error ${status}`;
  }

  return norm;
}

async function request(path, options = {}) {
  const cleanedPath = String(path || '');
  const base = API_BASE || '';
  const finalUrl = `${base}${cleanedPath.startsWith('/') ? '' : '/'}${cleanedPath}`.replace(/([^:]\/)\/+/g, '$1');

  const fetchOptions = {
    // Include credentials so cookie-based sessions work
    credentials: 'include',
    // default headers; allow override/extension via options.headers
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  if (allowDebug || (isDev && typeof isDev === 'function' && isDev())) {
    // eslint-disable-next-line no-console
    console.debug('[http][request]', fetchOptions.method || 'GET', finalUrl, options.body ? { body: options.body } : {});
  }

  const response = await fetch(finalUrl, fetchOptions);

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  let data;
  try {
    data = isJson ? await response.json() : await response.text();
  } catch (_e) {
    data = undefined;
  }

  if (!response.ok) {
    if (response.status === 401) {
      emit('unauthorized', { path, options });
    }

    const errNorm = normalizeError(response.status, data);
    if (allowWarn) {
      // eslint-disable-next-line no-console
      console.warn('[http][error]', errNorm.status, errNorm.code || '', errNorm.message, errNorm.details || '');
    }
    const err = new Error(errNorm.message);
    err.status = errNorm.status;
    err.code = errNorm.code;
    err.details = errNorm.details;
    err.payload = errNorm.raw;
    throw err;
  }

  if (allowInfo && response.status >= 200 && response.status < 300 && (fetchOptions.method || 'GET') !== 'GET') {
    // eslint-disable-next-line no-console
    console.info('[http][success]', fetchOptions.method || 'GET', finalUrl, response.status);
  }

  return data;
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
