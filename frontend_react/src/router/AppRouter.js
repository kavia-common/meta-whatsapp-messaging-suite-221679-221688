import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import TemplatesPage from '../pages/TemplatesPage';
import ContactsPage from '../pages/ContactsPage';
import MessagingPage from '../pages/MessagingPage';
import ApprovalsPage from '../pages/ApprovalsPage';
import SettingsPage from '../pages/SettingsPage';
import NotFound from '../pages/NotFound';

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** Router for application pages and feature modules.
   * Routes:
   *  - / (redirects to /dashboard)
   *  - /dashboard: Main dashboard landing
   *  - /templates: Manage templates
   *  - /contacts: Manage contacts
   *  - /messaging: Send bulk messages
   *  - /approvals: Template approvals
   *  - /settings: App/workspace settings
   *  - *: Catch-all -> NotFound
   */
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/messaging" element={<MessagingPage />} />
      <Route path="/approvals" element={<ApprovalsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
