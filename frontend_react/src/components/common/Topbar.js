import React from 'react';
import Button from './Button';

/**
 * Topbar component with brand, search placeholder, and actions.
 * Accepts onToggleTheme callback and currentTheme label for accessibility.
 */
// PUBLIC_INTERFACE
export default function Topbar({ onToggleTheme, themeLabel = 'Toggle theme' }) {
  return (
    <header className="topbar" role="banner">
      <div className="brand" style={{ marginBottom: 0 }}>
        <span aria-hidden="true">📘</span>
        <span style={{ color: 'var(--color-text)' }}>Ocean Professional</span>
      </div>

      <div className="search" role="search">
        <label htmlFor="top-search" className="visually-hidden">Search</label>
        <input id="top-search" placeholder="Search (coming soon)" aria-label="Search" disabled />
      </div>

      <div className="actions" role="group" aria-label="Quick actions">
        <Button onClick={onToggleTheme} ariaLabel={themeLabel}>Theme</Button>
        <Button variant="primary" disabled>New Template</Button>
        <Button variant="secondary" disabled>Import Contacts</Button>
      </div>
    </header>
  );
}
