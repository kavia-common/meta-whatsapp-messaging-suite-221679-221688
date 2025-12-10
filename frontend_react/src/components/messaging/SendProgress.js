import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import Table from '../common/Table';
import { env as appEnv } from '../../utils/env';
import { subscribe as subscribeProgress } from '../../ws/channels/messagingProgress';
import { getCampaign as fetchCampaign } from '../../api/messagingApi';

const POLL_INTERVAL = 3000;

/**
 * SendProgress
 * Displays current campaign status, counters, and a recent events feed.
 * Uses WebSocket real-time updates when REACT_APP_WS_URL is configured; otherwise falls back to polling.
 */
// PUBLIC_INTERFACE
export default function SendProgress({ campaign, events = [], loading = false }) {
  const [status, setStatus] = useState(campaign?.status || (loading ? 'starting' : 'idle'));
  const [counters, setCounters] = useState(campaign?.counters || { total: 0, queued: 0, sent: 0, delivered: 0, failed: 0 });
  const [isPolling, setIsPolling] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);

  const unsubRef = useRef(null);
  const pollRef = useRef(null);

  const useWS = useMemo(() => Boolean(appEnv.WS_URL), []);

  useEffect(() => {
    // Normalize from campaign prop on mount/update
    setStatus(campaign?.status || (loading ? 'starting' : 'idle'));
    setCounters(campaign?.counters || { total: 0, queued: 0, sent: 0, delivered: 0, failed: 0 });
  }, [campaign?.status, campaign?.counters, loading]);

  useEffect(() => {
    if (!campaign?.id) return () => {};

    const cid = String(campaign.id);

    const updateFromServer = async () => {
      try {
        const data = await fetchCampaign(cid);
        if (data) {
          setStatus(data.status || status);
          setCounters(data.counters || counters);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('SendProgress polling fetch failed', e);
      }
    };

    if (useWS) {
      // Real-time via WebSocket
      setIsRealtime(true);
      setIsPolling(false);

      // Initial snapshot
      updateFromServer();

      // Subscribe to WebSocket progress
      unsubRef.current = subscribeProgress(cid, (msg) => {
        const payload = msg?.data || msg;
        const nextCounters = {
          total: payload?.total ?? payload?.stats?.total ?? counters.total ?? 0,
          queued: payload?.queued ?? payload?.stats?.queued ?? counters.queued ?? 0,
          sent: payload?.sent ?? payload?.stats?.sent ?? counters.sent ?? 0,
          delivered: payload?.delivered ?? payload?.stats?.delivered ?? counters.delivered ?? 0,
          failed: payload?.failed ?? payload?.stats?.failed ?? counters.failed ?? 0,
        };
        const nextStatus = payload?.status || status || 'running';
        setCounters(nextCounters);
        setStatus(nextStatus);
      });
    } else {
      // Fallback to polling
      setIsRealtime(false);
      setIsPolling(true);

      updateFromServer(); // immediate
      pollRef.current = setInterval(updateFromServer, POLL_INTERVAL);
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      if (unsubRef.current) {
        try { unsubRef.current(); } catch (e) { /* ignore */ }
        unsubRef.current = null;
      }
      setIsPolling(false);
      setIsRealtime(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?.id, useWS]);

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
      subtitle={isRealtime ? 'Live delivery updates via WebSocket' : 'Live delivery updates (polling)'}
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
      {isPolling && <p style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>Updating every {POLL_INTERVAL / 1000}s</p>}
      {isRealtime && <p style={{ color: '#059669', fontSize: 12, marginTop: 8 }}>Live updates via WebSocket</p>}
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
