import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Table from '../common/Table';
import Badge from '../common/Badge';

/**
 * ContactListDetails
 * Shows metadata and the first N contacts of a selected list.
 */
// PUBLIC_INTERFACE
export default function ContactListDetails({ list, contacts = [], loading = false }) {
  const cols = useMemo(() => {
    if (!contacts || contacts.length === 0) {
      return [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'phone', header: 'Phone' },
      ];
    }
    // derive columns from first contact keys
    const keys = Object.keys(contacts[0] || {});
    return keys.map((k) => ({ key: k, header: k }));
  }, [contacts]);

  return (
    <Card
      title={(
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{list?.name || 'List'}</span>
          <Badge tone="primary">{(list?.contactsCount ?? contacts?.length ?? 0)} contacts</Badge>
          {list?.source ? <Badge tone="neutral">{list?.source}</Badge> : null}
        </div>
      )}
      subtitle="List details"
    >
      {loading ? <div style={{ padding: 8 }}><span className="spinner__label">Loading…</span></div> : null}
      <div style={{ marginBottom: 12, color: 'var(--color-muted)' }}>
        <div><strong>ID:</strong> {list?.id ?? '—'}</div>
        <div><strong>Created:</strong> {list?.createdAt ? new Date(list.createdAt).toLocaleString() : '—'}</div>
        <div><strong>Updated:</strong> {list?.updatedAt ? new Date(list.updatedAt).toLocaleString() : '—'}</div>
      </div>
      <Table
        columns={cols}
        data={contacts}
        emptyMessage="No contacts in this list."
        dense
      />
    </Card>
  );
}

ContactListDetails.propTypes = {
  list: PropTypes.object,
  contacts: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};
