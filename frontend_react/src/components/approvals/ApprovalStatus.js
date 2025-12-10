import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { fetchTemplateApprovalStatus } from '../../api/approvalsApi';

/**
 * ApprovalStatus
 * Displays the approval status for a given template and allows manual refresh.
 * Contains a polling placeholder that can be wired to store or timers later.
 */

// Map statuses to stylized badge colors based on Ocean Professional
const statusToColor = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'approved') return 'green';
  if (s === 'rejected') return 'red';
  if (s === 'in_review' || s === 'in-review' || s === 'pending') return 'blue';
  return 'gray';
};

// PUBLIC_INTERFACE
export default function ApprovalStatus({ templateId, autoRefreshMs = 0 }) {
  /** Approval status panel.
   * Props:
   *  - templateId: string (required)
   *  - autoRefreshMs: number (0 disables polling)
   */
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  const description = useMemo(() => {
    if (!status) return '';
    if (status.status === 'approved') return 'This template is approved and can be used for campaigns.';
    if (status.status === 'rejected') return status.reason ? `Rejected: ${status.reason}` : 'This template was rejected.';
    return 'Template is currently under review.';
  }, [status]);

  const load = async () => {
    if (!templateId) return;
    setLoading(true);
    setError('');
    const controller = new AbortController();
    try {
      const data = await fetchTemplateApprovalStatus(templateId, controller.signal);
      setStatus(data);
    } catch (e) {
      setError(e?.message || 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Polling placeholder: if autoRefreshMs > 0, set interval
    if (autoRefreshMs > 0) {
      timerRef.current = setInterval(() => {
        load();
      }, autoRefreshMs);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, autoRefreshMs]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[#111827]">Approval Status</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={load} disabled={loading || !templateId}>
            Refresh
          </Button>
        </div>
      </div>

      {!templateId && (
        <div className="text-sm text-gray-600">Select a template to view its approval status.</div>
      )}

      {templateId && (
        <>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <LoadingSpinner size="sm" />
              <span>Loading status...</span>
            </div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : status ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Template:</span>
                <span className="text-sm font-medium">{templateId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge color={statusToColor(status.status)}>{status.status || 'unknown'}</Badge>
              </div>
              {status.lastUpdated && (
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(status.lastUpdated).toLocaleString()}
                </div>
              )}
              {description && (
                <div className="text-sm text-gray-700">{description}</div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No status available.</div>
          )}
        </>
      )}
    </Card>
  );
}
