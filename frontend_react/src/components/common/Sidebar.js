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
          <button type="button" title="Message Templates (coming soon)" aria-disabled="true">Templates</button>
          <button type="button" title="Contacts (coming soon)" aria-disabled="true">Contacts</button>
          <button type="button" title="Approvals (coming soon)" aria-disabled="true">Approvals</button>
        </nav>
      </div>
    </aside>
  );
}
