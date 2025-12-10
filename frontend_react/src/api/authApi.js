import { getEnv } from '../utils/env';

/**
 * Authentication API utilities for session detection and login/logout helpers.
 * Uses frontend and backend URLs from environment variables.
 */

// PUBLIC_INTERFACE
export async function getSession() {
  /** Get the current authenticated session/user info from backend.
   * Returns:
   *  - { authenticated: boolean, user?: object } on success
   *  - { authenticated: false } on failure or 401
   */
  const backend = getBackendUrl();
  try {
    const resp = await fetch(`${backend}/api/auth/session`, {
      credentials: 'include',
      headers: { 'Accept': 'application/json' },
    });
    if (resp.status === 401) {
      return { authenticated: false };
    }
    if (!resp.ok) {
      return { authenticated: false };
    }
    const data = await resp.json();
    // Backends may vary; normalize to {authenticated, user}
    if (data && (data.authenticated === true || data.user)) {
      return { authenticated: true, user: data.user ?? data };
    }
    return { authenticated: false };
  } catch (e) {
    // Network or parsing error: treat as unauthenticated
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
  const backend = getBackendUrl();
  const frontend = getFrontendUrl();
  const target = redirectTo || (typeof window !== 'undefined' ? window.location.href : frontend);
  const url = new URL(`${backend}/api/auth/login`);
  url.searchParams.set('redirectTo', target);
  return url.toString();
}

// PUBLIC_INTERFACE
export async function logout(redirectTo) {
  /** Perform logout on the backend and redirect to landing or provided URL.
   * Params:
   *  - redirectTo: optional URL to navigate to after logout (defaults to frontend home)
   * Behavior:
   *  - Calls backend logout API with credentials and then redirects.
   */
  const backend = getBackendUrl();
  try {
    await fetch(`${backend}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Accept': 'application/json' },
    });
  } catch (_e) {
    // ignore network errors on logout
  }
  const dest = redirectTo || getFrontendUrl();
  if (typeof window !== 'undefined') {
    window.location.assign(dest);
  }
}

function getBackendUrl() {
  const backend = getEnv('REACT_APP_BACKEND_URL') || getEnv('REACT_APP_API_BASE') || '';
  if (!backend) {
    // Note for integrators: ensure REACT_APP_BACKEND_URL is set in .env
    console.warn('REACT_APP_BACKEND_URL is not set. Authentication may not work.');
  }
  return backend.replace(/\/+$/, '');
}

function getFrontendUrl() {
  const frontend = getEnv('REACT_APP_FRONTEND_URL') || (typeof window !== 'undefined' ? `${window.location.origin}` : '');
  if (!frontend) {
    console.warn('REACT_APP_FRONTEND_URL is not set; falling back to window.location.origin if available.');
  }
  return frontend.replace(/\/+$/, '');
}
