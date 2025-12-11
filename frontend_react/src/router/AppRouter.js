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
import LoginButton from '../components/auth/LoginButton';

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** App router with protected routes and explicit auth endpoints.
   * Public:
   *  - /, /dashboard
   *  - /auth/login (redirect helper)
   * Protected:
   *  - /templates, /contacts, /messaging, /approvals, /settings
   */
  const LoginRoute = () => {
    // When visiting /auth/login directly, take the user to the backend login URL
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Sign in to continue</h2>
          <p className="text-gray-600">You will be redirected to the login page.</p>
          <LoginButton redirectTo={redirectTo} />
        </div>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Public auth helper routes */}
      <Route path="/auth">
        <Route path="login" element={<LoginRoute />} />
      </Route>

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
