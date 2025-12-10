import React from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Table from '../common/Table';
import Button from '../common/Button';
import Badge from '../common/Badge';

/**
 * TemplateList
 * Displays a table of templates with actions: edit, submit, delete.
 */
// PUBLIC_INTERFACE
export default function TemplateList({ items = [], loading = false, onCreate, onEdit, onDelete, onSubmit }) {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'language', header: 'Lang', align: 'center' },
    { key: 'category', header: 'Category' },
    {
      key: (row) => <StatusCell row={row} />,
      header: 'Status',
      align: 'center',
    },
    {
      key: (row) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <Button size="sm" variant="outline" onClick={() => onEdit?.(row)}>Edit</Button>
          <Button size="sm" variant="secondary" onClick={() => onSubmit?.(row)} disabled={row.status === 'submitted' || row.status === 'approved'}>
            Submit
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete?.(row)}>Delete</Button>
        </div>
      ),
      header: 'Actions',
      align: 'right',
    },
  ];

  return (
    <Card
      title="Templates"
      subtitle="Create and manage your WhatsApp message templates"
      actions={<Button variant="primary" onClick={onCreate}>New Template</Button>}
    >
      {loading ? <div style={{ padding: 8 }}><span className="spinner__label">Loading…</span></div> : null}
      <Table
        columns={columns}
        data={items}
        emptyMessage="No templates yet. Click New Template to create your first."
      />
    </Card>
  );
}

function StatusCell({ row }) {
  const status = row?.status || 'draft';
  const tone = status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : status === 'submitted' ? 'primary' : 'neutral';
  return <Badge tone={tone}>{status}</Badge>;
}

StatusCell.propTypes = {
  row: PropTypes.object,
};

TemplateList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onCreate: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onSubmit: PropTypes.func,
};
