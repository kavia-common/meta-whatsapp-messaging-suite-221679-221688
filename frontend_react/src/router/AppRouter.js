import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../views/Dashboard';

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** Router for application pages and feature modules.
   * Routes:
   *  - /dashboard: Main dashboard landing
   *  - /: Redirects to /dashboard
   */
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Future routes:
          <Route path="/templates" element={<Templates />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/approvals" element={<Approvals />} />
      */}
    </Routes>
  );
}
