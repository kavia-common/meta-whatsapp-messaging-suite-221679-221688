import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTemplate, updateTemplate } from '../../state/slices/templatesSlice';
import Button from '../common/Button';
import Input from '../common/Input';
import TextArea from '../common/TextArea';

const TemplateForm = ({ existing, onSuccess }) => {
  const [name, setName] = useState(existing?.name || '');
  const [content, setContent] = useState(existing?.content || '');
  const dispatch = useDispatch();
  const loadingCreate = useSelector((s) => s.templates.loading.create);
  const loadingUpdate = useSelector((s) => s.templates.loading.update);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, content };
    if (existing?.id) {
      const res = await dispatch(updateTemplate({ id: existing.id, data: payload }));
      if (res?.meta?.requestStatus === 'fulfilled') onSuccess && onSuccess();
    } else {
      const res = await dispatch(createTemplate(payload));
      if (res?.meta?.requestStatus === 'fulfilled') onSuccess && onSuccess();
    }
  };

  const submitting = existing?.id ? loadingUpdate : loadingCreate;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextArea label="Content" value={content} onChange={(e) => setContent(e.target.value)} required rows={6} />
      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving...' : existing?.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;
