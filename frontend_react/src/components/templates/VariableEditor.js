import React from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * VariableEditor
 * Edits a set of variables (key/value). Variables are used to preview and send templates.
 */
// PUBLIC_INTERFACE
export default function VariableEditor({ variables = {}, onChange, onDetectFromText }) {
  const entries = Object.entries(variables || {});
  const handleChange = (key, value) => {
    const next = { ...(variables || {}), [key]: value };
    onChange?.(next);
  };

  const handleAdd = () => {
    // Create a new var with default name varN
    const existing = entries.map(([k]) => k);
    let n = entries.length + 1;
    let key = `var${n}`;
    while (existing.includes(key)) {
      n += 1;
      key = `var${n}`;
    }
    onChange?.({ ...variables, [key]: '' });
  };

  const handleRemove = (key) => {
    const next = { ...(variables || {}) };
    delete next[key];
    onChange?.(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontWeight: 600 }}>Variables</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" onClick={handleAdd}>Add variable</Button>
          {onDetectFromText ? (
            <Button size="sm" variant="ghost" onClick={onDetectFromText} ariaLabel="Detect variables from content">
              Auto-detect
            </Button>
          ) : null}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="toast toast--info" role="status">
          <div className="toast__content">No variables defined. Add variables or use Auto-detect based on placeholders like {'{{first_name}}'}.</div>
        </div>
      ) : null}

      <div style={{ display: 'grid', gap: 10 }}>
        {entries.map(([key, value]) => (
          <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'end' }}>
            <Input id={`var-key-${key}`} label="Key" value={key} onChange={() => {}} disabled />
            <Input id={`var-val-${key}`} label="Value" value={value} onChange={(e) => handleChange(key, e.target.value)} placeholder="Preview value" />
            <Button variant="ghost" ariaLabel={`Remove ${key}`} onClick={() => handleRemove(key)}>✕</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

VariableEditor.propTypes = {
  variables: PropTypes.object,
  onChange: PropTypes.func,
  onDetectFromText: PropTypes.func,
};
