import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates } from '../state/slices/templatesSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import TemplateForm from '../components/templates/TemplateForm';
import TemplateList from '../components/templates/TemplateList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TemplatesPage = () => {
  const dispatch = useDispatch();
  const templates = useSelector((s) => s.templates.items);
  const loading = useSelector((s) => s.templates.loading.fetch);
  const error = useSelector((s) => s.templates.error.fetch);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Templates</h2>
        <Button onClick={() => { setEditing(null); setShowForm(true); }} variant="primary">New Template</Button>
      </div>
      <Card>{showForm && <TemplateForm existing={editing} onSuccess={() => setShowForm(false)} />}</Card>
      {loading ? <LoadingSpinner /> : error ? <div className="text-red-600">{error}</div> : <TemplateList templates={templates} onEdit={(t) => { setEditing(t); setShowForm(true); }} />}
    </div>
  );
};

export default TemplatesPage;
