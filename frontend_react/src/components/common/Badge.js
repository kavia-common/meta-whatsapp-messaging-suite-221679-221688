import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge for small status indicators.
 */
// PUBLIC_INTERFACE
export default function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(['neutral', 'primary', 'success', 'danger', 'warning'])
};
