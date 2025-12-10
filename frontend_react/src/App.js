import React, { useEffect, useState } from 'react';
import './App.css';
import './styles/theme.css';
import AppRouter from './router/AppRouter';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';

/**
 * Root application layout. Provides:
 * - Ocean Professional theme variables and base structure
 * - Sidebar and Topbar components
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
      <Sidebar />
      <Topbar onToggleTheme={toggleTheme} themeLabel="Toggle theme" />
      <main className="content" role="main">
        <AppRouter />
      </main>
    </div>
  );
}
