import React from 'react';
import PropTypes from 'prop-types';

/**
 * Simple Tabs component (controlled).
 * tabs: [{ id, label }]
 * activeId: selected tab id
 * onChange: (id) => void
 */
// PUBLIC_INTERFACE
export default function Tabs({ tabs = [], activeId, onChange }) {
  return (
    <div className="tabs" role="tablist" aria-label="Tabs">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={t.id === activeId}
          className={`tab ${t.id === activeId ? 'tab--active' : ''}`}
          onClick={() => onChange?.(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, label: PropTypes.node.isRequired })),
  activeId: PropTypes.string,
  onChange: PropTypes.func
};
