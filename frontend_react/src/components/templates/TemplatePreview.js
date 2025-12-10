import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * TemplatePreview
 * Shows a formatted preview of the message with variables applied.
 */
// PUBLIC_INTERFACE
export default function TemplatePreview({ name, language, category, body = '', footer = '', buttons = [], variables = {} }) {
  const appliedBody = useMemo(() => applyVariables(body, variables), [body, variables]);
  const appliedFooter = useMemo(() => applyVariables(footer, variables), [footer, variables]);

  return (
    <Card
      title={(
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{name || 'Untitled template'}</span>
          {language ? <Badge tone="primary">{language}</Badge> : null}
          {category ? <Badge tone="success">{category}</Badge> : null}
        </div>
      )}
      subtitle="Preview"
    >
      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: 12,
        background: '#fff',
      }}>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{appliedBody || 'Message body…'}</div>
        {appliedFooter ? (
          <div style={{ marginTop: 12, color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            {appliedFooter}
          </div>
        ) : null}
        {Array.isArray(buttons) && buttons.length > 0 ? (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {buttons.map((b, idx) => (
              <button key={`${b?.type || 'btn'}-${idx}`} className="btn outline" type="button" disabled>
                {b?.text || 'Button'}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function applyVariables(text, variables) {
  if (!text) return text;
  return String(text).replace(/\{\{\s*([^}]+)\s*\}\}/g, (_m, key) => {
    const normalized = String(key || '').trim();
    const replacement = variables?.[normalized];
    return replacement !== undefined && replacement !== null && replacement !== '' ? String(replacement) : `{{${normalized}}}`;
  });
}

TemplatePreview.propTypes = {
  name: PropTypes.string,
  language: PropTypes.string,
  category: PropTypes.string,
  body: PropTypes.string,
  footer: PropTypes.string,
  buttons: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string, text: PropTypes.string })),
  variables: PropTypes.object,
};
