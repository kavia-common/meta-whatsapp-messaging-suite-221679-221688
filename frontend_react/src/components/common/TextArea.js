import React from 'react';
import PropTypes from 'prop-types';

/**
 * Accessible textarea with label, description, and error messaging.
 */
// PUBLIC_INTERFACE
export default function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  description,
  error,
  required = false,
  disabled = false,
  ...rest
}) {
  const descId = description ? `${id}-desc` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const ariaDescribedBy = [descId, errId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="form-field">
      {label ? (
        <label htmlFor={id} className="form-label">
          {label} {required ? <span className="req" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <textarea
        id={id}
        className={`form-input ${error ? 'form-input--error' : ''}`}
        value={value}
        rows={rows}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        {...rest}
      />
      {description ? (
        <div id={descId} className="form-desc">
          {description}
        </div>
      ) : null}
      {error ? (
        <div id={errId} className="form-error" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  description: PropTypes.node,
  error: PropTypes.node,
  required: PropTypes.bool,
  disabled: PropTypes.bool
};
