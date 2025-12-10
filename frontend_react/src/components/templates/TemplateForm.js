import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import Button from '../common/Button';
import VariableEditor from './VariableEditor';
import TemplatePreview from './TemplatePreview';
import { getLanguageOptions, getMetaCategoryOptions } from '../../utils/metaWhatsApp';
import { validateTemplateForm } from '../../utils/validators';

/**
 * TemplateForm
 * Controlled form for creating or editing templates.
 * Emits onSubmit(templatePayload) with normalized data.
 */
// PUBLIC_INTERFACE
export default function TemplateForm({ initialValue, onCancel, onSubmit, submitting = false }) {
  const [name, setName] = useState(initialValue?.name || '');
  const [language, setLanguage] = useState(initialValue?.language || 'en_US');
  const [category, setCategory] = useState(initialValue?.category || 'MARKETING');
  const [body, setBody] = useState(initialValue?.body || '');
  const [footer, setFooter] = useState(initialValue?.footer || '');
  const [buttons, setButtons] = useState(initialValue?.buttons || []);
  const [variables, setVariables] = useState(initialValue?.variables || {});
  const [errors, setErrors] = useState({});

  const isEdit = !!initialValue?.id;

  const templatePayload = useMemo(() => ({
    name: name.trim(),
    language,
    category,
    components: {
      body,
      footer,
      buttons,
    },
    variables,
  }), [name, language, category, body, footer, buttons, variables]);

  const handleAddButton = () => {
    const next = [...(buttons || []), { type: 'QUICK_REPLY', text: 'Button' }];
    setButtons(next);
  };

  const handleButtonChange = (idx, patch) => {
    const next = [...(buttons || [])];
    next[idx] = { ...(next[idx] || {}), ...patch };
    setButtons(next);
  };

  const handleRemoveButton = (idx) => {
    const next = [...(buttons || [])];
    next.splice(idx, 1);
    setButtons(next);
  };

  const detectVariables = () => {
    // Finds placeholders like {{first_name}} in body/footer
    const m = new Set();
    const re = /\{\{\s*([^}]+)\s*\}\}/g;
    const collect = (text) => {
      let match;
      while ((match = re.exec(text || '')) !== null) {
        const key = String(match[1]).trim();
        if (key) m.add(key);
      }
    };
    collect(body);
    collect(footer);
    const detected = Array.from(m);
    const next = { ...(variables || {}) };
    detected.forEach((k) => {
      if (!(k in next)) next[k] = '';
    });
    setVariables(next);
  };

  const submit = (e) => {
    e?.preventDefault?.();
    const { valid, errors: formErrors } = validateTemplateForm({
      name,
      category,
      language,
      components: { body, footer, buttons },
    });
    if (!valid) {
      setErrors(formErrors || {});
      return;
    }
    setErrors({});
    // Normalize structure used by backend
    const payload = {
      name: name.trim(),
      category,
      language,
      body,
      footer,
      buttons,
      variables,
    };
    onSubmit?.(payload);
  };

  const langOptions = useMemo(() => getLanguageOptions(), []);
  const catOptions = useMemo(() => getMetaCategoryOptions(), []);

  return (
    <form onSubmit={submit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <div>
          <Card title={isEdit ? 'Edit Template' : 'New Template'} subtitle="Details">
            <Input
              id="tpl-name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. promo_summer_2025"
              error={errors.name}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Select
                id="tpl-lang"
                label="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={langOptions}
                error={errors.language}
              />
              <Select
                id="tpl-category"
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={catOptions}
                error={errors.category}
              />
            </div>
            <TextArea
              id="tpl-body"
              label="Message body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Write message body. Use {{variable}} placeholders."
              required
              error={errors.body}
            />
            <TextArea
              id="tpl-footer"
              label="Footer (optional)"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              rows={3}
              placeholder="Add footer if needed"
              error={errors.footer}
            />

            <div style={{ marginTop: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Buttons</div>
                <Button size="sm" variant="outline" onClick={handleAddButton} type="button">Add button</Button>
              </div>
              {(!buttons || buttons.length === 0) ? (
                <div className="toast toast--info" role="status">
                  <div className="toast__content">No buttons. Add quick replies or CTAs as needed.</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 8 }}>
                  {buttons.map((b, idx) => (
                    <div key={`btn-${idx}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'end' }}>
                      <Select
                        id={`btn-type-${idx}`}
                        label="Type"
                        value={b.type || 'QUICK_REPLY'}
                        onChange={(e) => handleButtonChange(idx, { type: e.target.value })}
                        options={[
                          { value: 'QUICK_REPLY', label: 'Quick Reply' },
                          { value: 'URL', label: 'Open URL' },
                          { value: 'PHONE_NUMBER', label: 'Call Phone' },
                        ]}
                      />
                      <Input
                        id={`btn-text-${idx}`}
                        label="Text"
                        value={b.text || ''}
                        onChange={(e) => handleButtonChange(idx, { text: e.target.value })}
                        placeholder="Button label"
                        required
                      />
                      <Button variant="ghost" type="button" ariaLabel="Remove button" onClick={() => handleRemoveButton(idx)}>✕</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <VariableEditor variables={variables} onChange={setVariables} onDetectFromText={detectVariables} />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Saving…' : (isEdit ? 'Save changes' : 'Create template')}
              </Button>
              <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
          </Card>
        </div>

        <div>
          <TemplatePreview
            name={name}
            language={language}
            category={category}
            body={body}
            footer={footer}
            buttons={buttons}
            variables={variables}
          />
        </div>
      </div>
    </form>
  );
}

TemplateForm.propTypes = {
  initialValue: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
};
