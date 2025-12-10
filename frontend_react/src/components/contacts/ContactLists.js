import React from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Table from '../common/Table';
import Button from '../common/Button';
import Badge from '../common/Badge';

/**
 * ContactLists
 * Renders table of contact lists with selection.
 */
// PUBLIC_INTERFACE
export default function ContactLists({ items = [], loading = false, onRefresh, onUpload, onSelect }) {
  const columns = [
    { key: 'name', header: 'List Name' },
    { key: (row) => (row?.contactsCount ?? row?.count ?? 0), header: 'Contacts', align: 'center' },
    {
      key: (row) => <Badge tone="neutral">{row?.source || 'manual'}</Badge>,
      header: 'Source',
      align: 'center',
    },
    {
      key: (row) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <Button size="sm" variant="outline" onClick={() => onSelect?.(row)}>Details</Button>
        </div>
      ),
      header: 'Actions',
      align: 'right',
    },
  ];

  return (
    <Card
      title="Contact Lists"
      subtitle="Manage your contact lists. Upload CSV to create or update lists."
      actions={(
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" onClick={onRefresh}>Refresh</Button>
          <Button variant="primary" onClick={onUpload}>Upload CSV</Button>
        </div>
      )}
    >
      {loading ? <div style={{ padding: 8 }}><span className="spinner__label">Loading…</span></div> : null}
      <Table
        columns={columns}
        data={items}
        emptyMessage="No contact lists yet. Upload a CSV to create one."
      />
    </Card>
  );
}

ContactLists.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
  onUpload: PropTypes.func,
  onSelect: PropTypes.func,
};
