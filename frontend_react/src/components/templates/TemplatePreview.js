import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { LANGUAGE_LABELS, META_TEMPLATE_CATEGORY_LABELS } from '../../utils/constants';
import { renderPreviewParts } from '../../utils/metaWhatsApp';

/**
 * TemplatePreview
 * Shows a formatted preview of the message with variables applied.
 */
// PUBLIC_INTERFACE
export default function TemplatePreview({ name, language, category, body = '', footer = '', buttons = [], variables = {} }) {
  const appliedBody = useMemo(() => applyVariables(body, variables), [body, variables]);
  const appliedFooter = useMemo(() => applyVariables(footer, variables), [footer, variables]);

  const preview = useMemo(() => renderPreviewParts({ header: null, body: appliedBody, footer: appliedFooter, buttons }), [appliedBody, appliedFooter, buttons]);

  return (
    <Card
      title={(
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{name || 'Untitled template'}</span>
          {language ? <Badge tone="primary">{LANGUAGE_LABELS[language] || language}</Badge> : null}
          {category ? <Badge tone="success">{META_TEMPLATE_CATEGORY_LABELS[category] || category}</Badge> : null}
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
        {preview.header ? (
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{preview.header}</div>
        ) : null}
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{preview.body || 'Message body…'}</div>
        {preview.footer ? (
          <div style={{ marginTop: 12, color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            {preview.footer}
          </div>
        ) : null}
        {Array.isArray(preview.buttons) && preview.buttons.length > 0 ? (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {preview.buttons.map((b, idx) => (
              <button key={`${b?.type || 'btn'}-${idx}`} className="btn outline" type="button" disabled title={b?.meta?.url || b?.meta?.phone_number || undefined}>
                {b?.label || 'Button'}
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
