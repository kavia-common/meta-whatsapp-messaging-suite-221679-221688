import React from 'react';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Dashboard placeholder view.
   * Serves as the landing screen for the app.
   * Replace with widgets for template and contact KPIs in future iterations.
   */
  return (
    <div className="page" role="region" aria-label="Dashboard Overview">
      <h1>Dashboard</h1>
      <p className="muted">
        Welcome to the Meta WhatsApp Messaging Suite. Use the sidebar to navigate.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <div style={{ padding: 14, border: '1px solid var(--color-border)', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Templates</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>—</div>
        </div>
        <div style={{ padding: 14, border: '1px solid var(--color-border)', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Contacts</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>—</div>
        </div>
        <div style={{ padding: 14, border: '1px solid var(--color-border)', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Pending Approvals</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>—</div>
        </div>
      </div>
    </div>
  );
}
