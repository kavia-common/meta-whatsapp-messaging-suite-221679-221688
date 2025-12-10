import React from 'react';
import PropTypes from 'prop-types';

/**
 * Minimal Toast component (inline usage).
 * Use type to change accent color: info, success, error, warning.
 */
// PUBLIC_INTERFACE
export default function Toast({ message, type = 'info', onClose, action }) {
  if (!message) return null;
  return (
    <div className={`toast toast--${type}`} role="status">
      <div className="toast__content">{message}</div>
      <div className="toast__actions">
        {action}
        {onClose ? (
          <button className="btn ghost" aria-label="Close notification" onClick={onClose}>
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.node,
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
  onClose: PropTypes.func,
  action: PropTypes.node
};
