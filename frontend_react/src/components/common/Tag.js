import React from 'react';
import PropTypes from 'prop-types';

/**
 * Tag component for labeled tokens, optional remove control.
 */
// PUBLIC_INTERFACE
export default function Tag({ children, tone = 'neutral', onRemove, ariaLabelRemove = 'Remove' }) {
  return (
    <span className={`tag tag--${tone}`}>
      <span className="tag__label">{children}</span>
      {onRemove ? (
        <button className="tag__remove" aria-label={`${ariaLabelRemove} ${children}`} onClick={onRemove}>
          ✕
        </button>
      ) : null}
    </span>
  );
}

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(['neutral', 'primary', 'success', 'danger', 'warning']),
  onRemove: PropTypes.func,
  ariaLabelRemove: PropTypes.string
};
