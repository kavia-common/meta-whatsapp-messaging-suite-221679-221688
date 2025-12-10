/**
 * Axios HTTP client configured for the app.
 * - Base URL from env.API_BASE
 * - withCredentials enabled for cookie-based auth
 * - Interceptors:
 *    * Request: attaches default headers
 *    * Response: handles 401s and emits error toasts to console (UI toast integration can hook here)
 */

import axios from 'axios';
import { env, isDev } from '../utils/env';

// Simple toast gateway: for now logs; UI can subscribe later.
// PUBLIC_INTERFACE
export function notifyErrorToast(message, details) {
  /** Hook to show toast errors. Replace implementation to integrate with UI toasts. */
  // eslint-disable-next-line no-console
  console.error('[Toast][error]', message, details ?? '');
}

// Create the axios instance
const httpClient = axios.create({
  baseURL: env.API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add default headers (like X-Requested-With)
httpClient.interceptors.request.use(
  (config) => {
    const cfg = { ...config };
    cfg.headers = {
      ...cfg.headers,
      'X-Requested-With': 'XMLHttpRequest',
    };
    return cfg;
  },
  (error) => {
    if (isDev()) {
      // eslint-disable-next-line no-console
      console.warn('[http][request-error]', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to catch errors and 401 unauthorized
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred';

    if (status === 401) {
      // Not authenticated; downstream can redirect to login if applicable.
      notifyErrorToast('Your session has expired. Please sign in again.');
      // Optionally, we could emit an event or set a global store flag.
    } else {
      notifyErrorToast(message);
    }

    if (isDev()) {
      // eslint-disable-next-line no-console
      console.warn('[http][response-error]', { status, error });
    }

    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export default httpClient;
