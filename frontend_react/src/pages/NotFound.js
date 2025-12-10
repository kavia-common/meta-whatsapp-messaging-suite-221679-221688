import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFound - Displayed when no route matches.
 * Provides a link back to Dashboard.
 */
// PUBLIC_INTERFACE
export default function NotFound() {
  return (
    <div className="page" role="region" aria-label="Not Found">
      <h1>Page not found</h1>
      <p className="muted">We couldn't find what you were looking for.</p>
      <Link to="/dashboard" className="btn primary">Go to Dashboard</Link>
    </div>
  );
}
