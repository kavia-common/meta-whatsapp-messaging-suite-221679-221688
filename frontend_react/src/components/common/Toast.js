import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast, selectToasts } from '../../state/slices/uiSlice';

/**
 * PUBLIC_INTERFACE
 * ToastStack renders queued toasts from the Redux uiSlice and auto-dismisses them.
 */
export default function Toast() {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  useEffect(() => {
    const timers = toasts.map((t) => setTimeout(() => dispatch(hideToast(t.id)), 4000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dispatch]);

  if (!toasts?.length) return null;

  return (
    <div style={{ position: 'fixed', right: 16, top: 16, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999 }}>
      {toasts.map((t) => {
        const type = t.type || 'info';
        const bg =
          type === 'success' ? 'bg-green-50 border-green-400 text-green-700' :
          type === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
          'bg-blue-50 border-blue-400 text-blue-700';
        return (
          <div key={t.id} className={`border px-4 py-2 rounded shadow-sm ${bg}`}>
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
