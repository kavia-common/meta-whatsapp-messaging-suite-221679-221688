import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading spinner with accessible text.
 */
// PUBLIC_INTERFACE
export default function LoadingSpinner({ label = 'Loading', size = 20 }) {
  return (
    <div className="spinner" role="status" aria-live="polite" aria-label={label} title={label}>
      <svg width={size} height={size} viewBox="0 0 50 50" className="spinner__svg" aria-hidden>
        <circle className="spinner__track" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        <circle className="spinner__indicator" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
      </svg>
      <span className="spinner__label">{label}</span>
    </div>
  );
}

LoadingSpinner.propTypes = {
  label: PropTypes.string,
  size: PropTypes.number
};
