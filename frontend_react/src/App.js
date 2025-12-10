import React, { useEffect, useState } from 'react';
import './App.css';
import './styles/theme.css';
import AppRouter from './router/AppRouter';

/**
 * Root application layout. Provides:
 * - Ocean Professional theme variables and base structure
 * - Sidebar and Topbar placeholders (skeleton)
 * - Content area with routed views
 */
// PUBLIC_INTERFACE
export default function App() {
  const [theme, setTheme] = useState('light');

  // Apply data-theme attribute for potential future theme switching.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="layout" data-testid="app-layout">
      {/* Sidebar */}
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <span aria-hidden="true">💬</span>
          <span>Meta WhatsApp Suite</span>
          <span className="badge">Ocean</span>
        </div>

        <div className="nav-section">
          <div className="nav-title">Main</div>
          <nav className="nav" role="navigation">
            <a href="/dashboard" className="active" aria-current="page">Dashboard</a>
            <button type="button" title="Message Templates (coming soon)" aria-disabled="true">Templates</button>
            <button type="button" title="Contacts (coming soon)" aria-disabled="true">Contacts</button>
            <button type="button" title="Approvals (coming soon)" aria-disabled="true">Approvals</button>
          </nav>
        </div>
      </aside>

      {/* Topbar */}
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
          <button className="btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button className="btn primary" disabled>New Template</button>
          <button className="btn secondary" disabled>Import Contacts</button>
        </div>
      </header>

      {/* Content */}
      <main className="content" role="main">
        <AppRouter />
      </main>
    </div>
  );
}
