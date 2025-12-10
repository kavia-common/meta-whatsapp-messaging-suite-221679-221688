import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import TemplatesPage from '../pages/TemplatesPage';
import ContactsPage from '../pages/ContactsPage';
import MessagingPage from '../pages/MessagingPage';
import ApprovalsPage from '../pages/ApprovalsPage';
import SettingsPage from '../pages/SettingsPage';
import NotFound from '../pages/NotFound';
import AuthGuard from '../components/auth/AuthGuard';

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** App router with protected routes.
   * Public:
   *  - / and /dashboard
   * Protected:
   *  - /templates, /contacts, /messaging, /approvals, /settings
   */
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/templates"
        element={
          <AuthGuard>
            <TemplatesPage />
          </AuthGuard>
        }
      />
      <Route
        path="/contacts"
        element={
          <AuthGuard>
            <ContactsPage />
          </AuthGuard>
        }
      />
      <Route
        path="/messaging"
        element={
          <AuthGuard>
            <MessagingPage />
          </AuthGuard>
        }
      />
      <Route
        path="/approvals"
        element={
          <AuthGuard>
            <ApprovalsPage />
          </AuthGuard>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthGuard>
            <SettingsPage />
          </AuthGuard>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
