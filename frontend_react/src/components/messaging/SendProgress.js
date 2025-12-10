import React from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import Table from '../common/Table';

/**
 * SendProgress
 * Displays current campaign status, counters, and a recent events feed.
 * Designed to be updated by polling or WebSocket in a later step.
 */
// PUBLIC_INTERFACE
export default function SendProgress({ campaign, events = [], loading = false }) {
  const status = campaign?.status || (loading ? 'starting' : 'idle');
  const counters = campaign?.counters || { total: 0, queued: 0, sent: 0, delivered: 0, failed: 0 };

  const tone =
    status === 'running' ? 'primary' :
    status === 'completed' ? 'success' :
    status === 'failed' ? 'danger' :
    'neutral';

  const cols = [
    { key: 'ts', header: 'Time' },
    { key: 'type', header: 'Event' },
    { key: 'message', header: 'Message' },
  ];

  const normalizedEvents = (events || []).map((e, idx) => ({
    id: e.id || idx,
    ts: e.ts ? new Date(e.ts).toLocaleTimeString() : '',
    type: e.type || 'info',
    message: e.message || '',
  }));

  return (
    <Card
      title={(
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Send Progress</span>
          <Badge tone={tone}>{status}</Badge>
        </div>
      )}
      subtitle="Live delivery updates (WebSocket integration coming soon)"
    >
      {loading ? <LoadingSpinner label="Starting campaign" /> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, margin: '8px 0 12px' }}>
        <Metric label="Total" value={counters.total} />
        <Metric label="Queued" value={counters.queued} />
        <Metric label="Sent" value={counters.sent} />
        <Metric label="Delivered" value={counters.delivered} />
        <Metric label="Failed" value={counters.failed} />
      </div>
      <Table columns={cols} data={normalizedEvents} emptyMessage="No events yet." dense />
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

SendProgress.propTypes = {
  campaign: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ts: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    type: PropTypes.string,
    message: PropTypes.string,
  })),
  loading: PropTypes.bool,
};
