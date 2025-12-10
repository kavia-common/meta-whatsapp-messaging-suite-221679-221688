import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component with Ocean Professional theme styling.
 * Supports variants: primary, secondary, outline, ghost, danger.
 * Accessible by default with proper aria attributes and disabled handling.
 */
// PUBLIC_INTERFACE
export default function Button({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
  iconLeft,
  iconRight,
  fullWidth = false,
  ...rest
}) {
  const classes = [
    'btn',
    variantClass(variant),
    sizeClass(size),
    fullWidth ? 'btn--full' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {iconLeft ? <span className="btn__icon btn__icon--left" aria-hidden>{iconLeft}</span> : null}
      <span className="btn__label">{children}</span>
      {iconRight ? <span className="btn__icon btn__icon--right" aria-hidden>{iconRight}</span> : null}
    </button>
  );
}

function variantClass(variant) {
  switch (variant) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'secondary';
    case 'outline':
      return 'outline';
    case 'ghost':
      return 'ghost';
    case 'danger':
      return 'danger';
    default:
      return '';
  }
}

function sizeClass(size) {
  switch (size) {
    case 'sm':
      return 'btn--sm';
    case 'lg':
      return 'btn--lg';
    default:
      return '';
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  ariaLabel: PropTypes.string,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  fullWidth: PropTypes.bool
};
