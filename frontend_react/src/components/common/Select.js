import React from 'react';
import PropTypes from 'prop-types';

/**
 * Accessible Select component with label, description, and error.
 */
// PUBLIC_INTERFACE
export default function Select({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
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

      <select
        id={id}
        className={`form-input ${error ? 'form-input--error' : ''}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        {...rest}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

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

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.any, label: PropTypes.node })),
  placeholder: PropTypes.string,
  description: PropTypes.node,
  error: PropTypes.node,
  required: PropTypes.bool,
  disabled: PropTypes.bool
};
