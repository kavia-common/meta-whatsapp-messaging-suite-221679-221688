import React, { useEffect, useState } from 'react';
import Button from './Button';
import LoginButton from '../auth/LoginButton';
import LogoutButton from '../auth/LogoutButton';
import { getSession } from '../../api/authApi';

/**
 * Topbar component with brand, search placeholder, actions and auth buttons.
 * Accepts onToggleTheme callback and currentTheme label for accessibility.
 */
// PUBLIC_INTERFACE
export default function Topbar({ onToggleTheme, themeLabel = 'Toggle theme' }) {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getSession();
      if (!mounted) return;
      setAuthed(res.authenticated === true);
    })();
    return () => { mounted = false; };
  }, []);

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

      <div className="actions" role="group" aria-label="Quick actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button onClick={onToggleTheme} ariaLabel={themeLabel}>Theme</Button>
        <Button variant="primary" disabled>New Template</Button>
        <Button variant="secondary" disabled>Import Contacts</Button>
        <div style={{ marginLeft: 8 }}>
          {authed ? <LogoutButton /> : <LoginButton />}
        </div>
      </div>
    </header>
  );
}
