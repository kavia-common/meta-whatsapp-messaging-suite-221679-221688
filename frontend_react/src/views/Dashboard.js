import React, { useEffect } from 'react';
import { useStore, selectors } from '../state/store';
import { fetchTemplates } from '../state/slices/templatesSlice';
import { fetchContacts } from '../state/slices/contactsSlice';
import { fetchApprovals } from '../state/slices/approvalsSlice';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Dashboard view reading counts from global store with safe fallbacks. */
  const { state, dispatch } = useStore();

  const templatesCount = selectors.templatesCount(state);
  const contactsCount = selectors.contactsCount(state);
  const pendingApprovalsCount = selectors.pendingApprovalsCount(state);

  useEffect(() => {
    // Initial background fetches (idempotent placeholder).
    dispatch(fetchTemplates());
    dispatch(fetchContacts());
    dispatch(fetchApprovals());
  }, [dispatch]);

  return (
    <div className="page" role="region" aria-label="Dashboard Overview">
      <h1>Dashboard</h1>
      <p className="muted">
        Welcome to the Meta WhatsApp Messaging Suite. Use the sidebar to navigate.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <div style={{ padding: 14, border: '1px solid var(--color-border)', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Templates</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{templatesCount ?? 0}</div>
        </div>
        <div style={{ padding: 14, border: '1px solid var(--color-border)', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Contacts</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{contactsCount ?? 0}</div>
        </div>
        <div style={{ padding: 14, border: '1px solid var(--color-border)', borderRadius: '10px', background: '#fff' }}>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Pending Approvals</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{pendingApprovalsCount ?? 0}</div>
        </div>
      </div>
    </div>
  );
}
