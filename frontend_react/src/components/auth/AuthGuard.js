import React, { useEffect, useState } from 'react';
import { getSession, getLoginUrl } from '../../api/authApi';
import LoadingSpinner from '../common/LoadingSpinner';
import { onAuthEvent } from '../../api/httpClient';

/**
 * AuthGuard wraps protected routes, verifying a session and rendering children if authenticated.
 * When not authenticated, it redirects to the backend login flow via /auth/login helper.
 */

// PUBLIC_INTERFACE
export default function AuthGuard({ children }) {
  /** Protect child elements by requiring authentication.
   * Renders a loading spinner while checking session.
   * If unauthenticated, redirect to /auth/login using backend URL.
   */
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const res = await getSession();
      if (!mounted) return;
      setAuthed(res.authenticated === true);
      setLoading(false);

      if (!res.authenticated) {
        // redirect to login
        try {
          const url = getLoginUrl(window.location.href);
          window.location.assign(url);
        } catch (_e) {
          // fallback to frontend route
          window.location.assign('/auth/login');
        }
      }
    };

    check();

    // Also listen for runtime 401s to force re-auth
    const off = onAuthEvent((event) => {
      if (event === 'unauthorized') {
        try {
          const url = getLoginUrl(window.location.href);
          window.location.assign(url);
        } catch (_e) {
          window.location.assign('/auth/login');
        }
      }
    });

    return () => {
      mounted = false;
      if (typeof off === 'function') off();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!authed) {
    // During redirect, render nothing to avoid flicker
    return null;
  }

  return <>{children}</>;
}
