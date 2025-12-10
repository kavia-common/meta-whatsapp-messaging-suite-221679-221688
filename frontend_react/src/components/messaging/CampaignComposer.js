import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import VariableEditor from '../templates/VariableEditor';
import TemplatePreview from '../templates/TemplatePreview';
import { useStore } from '../../state/store';
import { fetchTemplates } from '../../state/slices/templatesSlice';
import { listContactLists } from '../../api/contactsApi';
import { TemplateStatus } from '../../utils/constants';

/**
 * CampaignComposer
 * Allows the user to select an approved template and a contact list, set schedule, and define variables.
 * Emits onStart({ templateId, contactListId, variables, schedule }) when user starts the campaign.
 */
// PUBLIC_INTERFACE
export default function CampaignComposer({ onStart }) {
  const { state, dispatch } = useStore();
  const templates = state.templates?.items || [];
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const [templateId, setTemplateId] = useState('');
  const [contactListId, setContactListId] = useState('');
  const [variables, setVariables] = useState({});
  const [scheduleType, setScheduleType] = useState('now'); // 'now' | 'later'
  const [scheduleAt, setScheduleAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load templates (for selection) on mount
  useEffect(() => {
    if (!templates || templates.length === 0) {
      dispatch(fetchTemplates());
    }
  }, [dispatch]); // omit templates to avoid re-fetching

  // Load contact lists
  const refreshContacts = async () => {
    setLoadingContacts(true);
    try {
      const res = await listContactLists();
      setContacts(Array.isArray(res) ? res : (res?.items || []));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to load contact lists', e);
    } finally {
      setLoadingContacts(false);
    }
  };
  useEffect(() => { refreshContacts(); }, []);

  // Only approved/submitted templates should be selectable
  const approvedTemplates = useMemo(
    () => (templates || []).filter((t) => {
      const s = String(t.status || '').toUpperCase();
      return [TemplateStatus.APPROVED, TemplateStatus.PENDING, 'SUBMITTED'].includes(s);
    }),
    [templates]
  );

  const selectedTemplate = useMemo(
    () => approvedTemplates.find((t) => String(t.id) === String(templateId)),
    [approvedTemplates, templateId]
  );

  const templateOptions = useMemo(
    () => approvedTemplates.map((t) => ({ value: t.id, label: `${t.name} (${t.language || 'lang'})` })),
    [approvedTemplates]
  );

  const contactOptions = useMemo(
    () => (contacts || []).map((c) => ({ value: c.id, label: `${c.name || c.id} (${c.contactsCount ?? c.count ?? 0})` })),
    [contacts]
  );

  const validate = () => {
    if (!templateId) return 'Please select an approved template.';
    if (!contactListId) return 'Please select a contact list.';
    if (scheduleType === 'later') {
      if (!scheduleAt) return 'Please choose a schedule date/time.';
      const at = new Date(scheduleAt);
      if (Number.isNaN(at.getTime())) return 'Invalid schedule date/time.';
    }
    return null;
  };

  const handleStart = async () => {
    const err = validate();
    if (err) return setError(err);
    setError(null);
    setSubmitting(true);
    try {
      const schedule = scheduleType === 'now' ? { type: 'now' } : { type: 'later', at: new Date(scheduleAt).toISOString() };
      await onStart?.({ templateId, contactListId, variables, schedule });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
      <div>
        <Card
          title="Compose Campaign"
          subtitle="Choose an approved template, a contact list, and schedule your send"
          actions={<Button variant="outline" onClick={refreshContacts} disabled={loadingContacts}>Refresh lists</Button>}
        >
          <Select
            id="cmp-template"
            label="Template"
            placeholder={approvedTemplates.length ? 'Select an approved template' : 'No approved templates. Please approve one first.'}
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            options={templateOptions}
            required
          />
          <Select
            id="cmp-list"
            label="Contact list"
            placeholder={contacts.length ? 'Select a contact list' : 'No lists available'}
            value={contactListId}
            onChange={(e) => setContactListId(e.target.value)}
            options={contactOptions}
            required
            disabled={loadingContacts}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Select
              id="cmp-schedule-type"
              label="Schedule"
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              options={[
                { value: 'now', label: 'Send now' },
                { value: 'later', label: 'Schedule for later' },
              ]}
            />
            <Input
              id="cmp-schedule-at"
              label="Schedule at"
              type="datetime-local"
              value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)}
              disabled={scheduleType !== 'later'}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <VariableEditor variables={variables} onChange={setVariables} onDetectFromText={() => { /* noop for composer */ }} />
          </div>

          {error ? <div className="form-error" role="alert" style={{ marginTop: 8 }}>{error}</div> : null}

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="primary" onClick={handleStart} disabled={submitting}>
              {submitting ? 'Starting…' : 'Start Campaign'}
            </Button>
          </div>
        </Card>
      </div>

      <div>
        <TemplatePreview
          name={selectedTemplate?.name}
          language={selectedTemplate?.language}
          category={selectedTemplate?.category}
          body={selectedTemplate?.body}
          footer={selectedTemplate?.footer}
          buttons={selectedTemplate?.buttons}
          variables={variables}
        />
      </div>
    </div>
  );
}

CampaignComposer.propTypes = {
  onStart: PropTypes.func,
};
