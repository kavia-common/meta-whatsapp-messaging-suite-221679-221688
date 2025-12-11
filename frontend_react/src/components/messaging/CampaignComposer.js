import React, { useState } from 'react';
import Button from '../common/Button';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import { sendCampaign } from '../../state/slices/messagingSlice';

const CampaignComposer = ({ templates = [], lists = [] }) => {
  const [templateId, setTemplateId] = useState('');
  const [listId, setListId] = useState('');
  const [variables, setVariables] = useState('');
  const dispatch = useDispatch();
  const sending = useSelector((s) => s.messaging.loading.send);

  const startCampaign = async () => {
    await dispatch(sendCampaign({ templateId, listId, variables }));
  };

  return (
    <div className="space-y-3">
      <Select label="Template" value={templateId} onChange={(e) => setTemplateId(e.target.value)} options={templates.map(t => ({ value: t.id, label: t.name }))} />
      <Select label="Contact List" value={listId} onChange={(e) => setListId(e.target.value)} options={lists.map(l => ({ value: l.id, label: l.name }))} />
      <TextArea label="Variables (JSON)" value={variables} onChange={(e) => setVariables(e.target.value)} rows={6} />
      <Button variant="primary" onClick={startCampaign} disabled={sending}>{sending ? 'Sending...' : 'Send'}</Button>
    </div>
  );
};

export default CampaignComposer;
