import React, { useEffect, useState } from 'react';
import { getSession, getLoginUrl } from '../../api/authApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * AuthGuard wraps protected routes, verifying a session and rendering children if authenticated.
 * When not authenticated, it shows a call-to-action to sign in.
 */

// PUBLIC_INTERFACE
export default function AuthGuard({ children }) {
  /** Protect child elements by requiring authentication.
   * Renders a loading spinner while checking session.
   * If unauthenticated, renders a login prompt with a Sign in button.
   */
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getSession();
      if (!mounted) return;
      setAuthed(res.authenticated === true);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!authed) {
    const login = () => {
      const url = getLoginUrl(window.location.href);
      window.location.assign(url);
    };
    return (
      <div className="max-w-xl mx-auto mt-16">
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Authentication required</h2>
            <p className="text-gray-600">
              Please sign in to access this section. You will be redirected back here after a successful login.
            </p>
            <Button onClick={login} variant="primary">Sign in</Button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
