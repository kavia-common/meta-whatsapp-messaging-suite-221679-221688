import React from 'react';
import PropTypes from 'prop-types';

/**
 * Accessible text input with label, description, and error messaging.
 */
// PUBLIC_INTERFACE
export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  description,
  error,
  required = false,
  disabled = false,
  autoComplete,
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

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        autoComplete={autoComplete}
        className={`form-input ${error ? 'form-input--error' : ''}`}
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

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  description: PropTypes.node,
  error: PropTypes.node,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  autoComplete: PropTypes.string
};
