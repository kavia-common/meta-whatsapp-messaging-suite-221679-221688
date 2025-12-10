import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Modal dialog with accessible role, aria, and focus management.
 * Minimal styling via theme.css classes.
 */
// PUBLIC_INTERFACE
export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeLabel = 'Close'
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open && dialogRef.current) {
      const focusable = dialogRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        <div className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <Button ariaLabel={closeLabel} variant="ghost" onClick={onClose}>✕</Button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__footer">
          {footer ?? <Button onClick={onClose}>{closeLabel}</Button>}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  closeLabel: PropTypes.string
};
