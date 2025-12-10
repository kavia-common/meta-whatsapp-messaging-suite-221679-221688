import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Sidebar navigation component using Ocean Professional theme styles.
 * Contains navigation links without business logic.
 */
// PUBLIC_INTERFACE
export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand">
        <span aria-hidden="true">💬</span>
        <span>Meta WhatsApp Suite</span>
        <span className="badge">Ocean</span>
      </div>

      <div className="nav-section">
        <div className="nav-title">Main</div>
        <nav className="nav" role="navigation">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Dashboard
          </NavLink>
          <NavLink to="/templates" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Templates
          </NavLink>
          <NavLink to="/contacts" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Contacts
          </NavLink>
          <NavLink to="/messaging" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Messaging
          </NavLink>
          <NavLink to="/approvals" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Approvals
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Settings
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
