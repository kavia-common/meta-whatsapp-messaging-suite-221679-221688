import httpClient from './httpClient';
import { getEnv } from '../utils/env';

/**
 * Authentication API utilities for session detection and login/logout helpers.
 * Uses shared httpClient for consistent normalized errors.
 */

// PUBLIC_INTERFACE
export async function getSession() {
  /** Get the current authenticated session/user info from backend.
   * Returns:
   *  - { authenticated: boolean, user?: object } on success
   *  - { authenticated: false } on failure or 401
   */
  try {
    const data = await httpClient.get('/auth/session');
    if (data && (data.authenticated === true || data.user)) {
      return { authenticated: true, user: data.user ?? data };
    }
    return { authenticated: false };
  } catch (e) {
    if (e && e.status === 401) return { authenticated: false };
    return { authenticated: false };
  }
}

// PUBLIC_INTERFACE
export function getLoginUrl(redirectTo) {
  /** Construct the login URL on the backend, including redirect back to this app.
   * Params:
   *  - redirectTo: optional URL to return to after login (defaults to current location)
   * Returns: string URL
   */
  const base = getApiBaseUrl();
  const target = redirectTo || (typeof window !== 'undefined' ? window.location.href : getFrontendUrl());
  const url = new URL(`${base}/auth/login`);
  url.searchParams.set('redirectTo', target);
  return url.toString();
}

 // PUBLIC_INTERFACE
export async function logout(redirectTo) {
  /** Perform logout on the backend and redirect to landing or provided URL. */
  try {
    await httpClient.post('/auth/logout');
  } catch (_e) {
    // ignore network errors on logout
  }
  const dest = redirectTo || getFrontendUrl() || '/';
  if (typeof window !== 'undefined') {
    window.location.assign(dest);
  }
}

function getApiBaseUrl() {
  const backend = getEnv('REACT_APP_API_BASE') || getEnv('REACT_APP_BACKEND_URL') || '';
  return backend.replace(/\/+$/, '');
}

function getFrontendUrl() {
  const frontend = getEnv('REACT_APP_FRONTEND_URL') || (typeof window !== 'undefined' ? `${window.location.origin}` : '');
  return frontend.replace(/\/+$/, '');
}
