import React from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Table from '../common/Table';
import Badge from '../common/Badge';

/**
 * DeliveryReport
 * Shows final campaign report: aggregate metrics and sample breakdown.
 */
// PUBLIC_INTERFACE
export default function DeliveryReport({ report }) {
  if (!report) {
    return (
      <Card title="Delivery Report" subtitle="Final results">
        <div className="toast toast--info">
          <div className="toast__content">No report available yet. It will appear here after completion.</div>
        </div>
      </Card>
    );
  }

  const totals = report?.totals || { total: 0, sent: 0, delivered: 0, failed: 0, read: 0, replied: 0 };
  const rows = report?.breakdown || [];

  const cols = [
    { key: 'segment', header: 'Segment' },
    { key: (r) => r.total ?? 0, header: 'Total', align: 'right' },
    { key: (r) => r.sent ?? 0, header: 'Sent', align: 'right' },
    { key: (r) => r.delivered ?? 0, header: 'Delivered', align: 'right' },
    { key: (r) => r.failed ?? 0, header: 'Failed', align: 'right' },
  ];

  return (
    <Card
      title={(
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Delivery Report</span>
          <Badge tone="success">completed</Badge>
        </div>
      )}
      subtitle="Overview and breakdown"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
        <Metric label="Total" value={totals.total} />
        <Metric label="Sent" value={totals.sent} />
        <Metric label="Delivered" value={totals.delivered} />
        <Metric label="Failed" value={totals.failed} />
        <Metric label="Read" value={totals.read} />
      </div>

      <Table data={rows} columns={cols} emptyMessage="No breakdown data." />
    </Card>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ padding: 10, border: '1px solid var(--color-border)', borderRadius: 10, background: '#fff' }}>
      <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value ?? 0}</div>
    </div>
  );
}
Metric.propTypes = { label: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) };

DeliveryReport.propTypes = {
  report: PropTypes.shape({
    totals: PropTypes.object,
    breakdown: PropTypes.arrayOf(PropTypes.object),
  }),
};
