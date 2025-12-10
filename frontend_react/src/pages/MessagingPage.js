import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CampaignComposer from '../components/messaging/CampaignComposer';
import SendProgress from '../components/messaging/SendProgress';
import DeliveryReport from '../components/messaging/DeliveryReport';
import Toast from '../components/common/Toast';
import { createCampaign, getCampaign, getCampaignReport } from '../api/messagingApi';
import Button from '../components/common/Button';

/**
 * MessagingPage - Compose and start campaigns, display live progress and final delivery report.
 * WebSocket integration will be added later; currently uses lightweight polling.
 */
// PUBLIC_INTERFACE
export default function MessagingPage() {
  const [campaign, setCampaign] = useState(null);            // { id, status, counters }
  const [events, setEvents] = useState([]);                  // [{ ts, type, message }]
  const [report, setReport] = useState(null);                // final report
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const pollTimer = useRef(null);

  const isActive = useMemo(() => {
    const st = campaign?.status;
    return st === 'running' || st === 'queued' || st === 'starting';
  }, [campaign]);

  // Start campaign via API
  const handleStart = useCallback(async ({ templateId, contactListId, variables, schedule }) => {
    setLoading(true);
    setReport(null);
    setEvents([]);
    try {
      const created = await createCampaign({ templateId, contactListId, variables, schedule });
      const normalized = {
        id: created?.id || created?.campaignId || created?.uuid,
        status: created?.status || 'starting',
        counters: created?.counters || { total: 0, queued: 0, sent: 0, delivered: 0, failed: 0 },
      };
      if (!normalized.id) {
        throw new Error('Campaign ID missing from server response.');
      }
      setCampaign(normalized);
      setToast({ message: 'Campaign started', type: 'success' });
    } catch (e) {
      setToast({ message: e?.message || 'Failed to start campaign', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll campaign status until completed/failed
  useEffect(() => {
    if (!campaign?.id) return;

    const poll = async () => {
      try {
        const data = await getCampaign(campaign.id);
        if (data) {
          setCampaign((prev) => ({
            id: prev?.id || data.id,
            status: data.status || prev?.status || 'running',
            counters: data.counters || prev?.counters || {},
          }));
          // Append any new events if server sends them (placeholder: data.events)
          if (Array.isArray(data.events) && data.events.length > 0) {
            setEvents((prev) => {
              const merged = [...prev, ...data.events.map((e, idx) => ({ id: e.id || `${Date.now()}-${idx}`, ...e }))];
              // De-dup by id
              const map = new Map();
              merged.forEach((ev) => map.set(ev.id, ev));
              return Array.from(map.values()).slice(-200);
            });
          }
          // Stop polling on terminal states and fetch report
          if (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled') {
            clearInterval(pollTimer.current);
            pollTimer.current = null;
            try {
              const rep = await getCampaignReport(campaign.id);
              setReport(rep);
              if (data.status === 'completed') {
                setToast({ message: 'Campaign completed', type: 'success' });
              } else if (data.status === 'failed') {
                setToast({ message: 'Campaign failed', type: 'error' });
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('Failed to fetch report', e);
            }
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Polling error', e);
      }
    };

    // Start polling
    if (!pollTimer.current) {
      poll(); // immediate
      pollTimer.current = setInterval(poll, 2000);
    }

    return () => {
      if (pollTimer.current) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    };
  }, [campaign?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setCampaign(null);
    setEvents([]);
    setReport(null);
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  };

  return (
    <div className="page" role="region" aria-label="Messaging">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 12 }}>
        <div>
          <h1>Messaging</h1>
          <p className="muted">Compose a campaign, pick contacts and schedule. Monitor progress and review delivery report.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" onClick={reset} disabled={!campaign && !report}>Reset</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <CampaignComposer onStart={handleStart} />

        {campaign ? (
          <SendProgress campaign={campaign} events={events} loading={loading || isActive} />
        ) : null}

        {report ? (
          <DeliveryReport report={report} />
        ) : null}
      </div>

      <div style={{ position: 'fixed', bottom: 20, right: 20, width: 360 }}>
        <Toast
          message={toast?.message}
          type={toast?.type || 'info'}
          onClose={() => setToast(null)}
        />
      </div>
    </div>
  );
}
