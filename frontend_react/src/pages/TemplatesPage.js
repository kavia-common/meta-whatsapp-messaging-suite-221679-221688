import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../state/store';
import { fetchTemplates, setTemplates } from '../state/slices/templatesSlice';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import TemplateList from '../components/templates/TemplateList';
import TemplateForm from '../components/templates/TemplateForm';
import { listTemplates, createTemplate, updateTemplate, deleteTemplate as apiDeleteTemplate, submitTemplate } from '../api/templatesApi';
import Button from '../components/common/Button';

/**
 * TemplatesPage - Manage WhatsApp templates: list, create, edit, delete, submit to Meta.
 * Uses global store for baseline items and reflects API mutations locally for responsiveness.
 */
// PUBLIC_INTERFACE
export default function TemplatesPage() {
  const { state, dispatch } = useStore();
  const items = state.templates?.items || [];
  const loading = state.templates?.loading || false;

  // UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Load initial list
  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const title = useMemo(() => (editing ? 'Edit Template' : 'New Template'), [editing]);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (tpl) => {
    setEditing(tpl);
    setModalOpen(true);
  };

  const handleDelete = async (tpl) => {
    if (!tpl?.id) {
      // For local-only item fallback, filter by name
      const next = items.filter((t) => t !== tpl);
      dispatch(setTemplates(next));
      return;
    }
    try {
      await apiDeleteTemplate(tpl.id);
      const next = items.filter((t) => t.id !== tpl.id);
      dispatch(setTemplates(next));
      setToast({ message: `Deleted ${tpl.name}`, type: 'success' });
    } catch (e) {
      setToast({ message: e?.message || 'Failed to delete template', type: 'error' });
    }
  };

  const handleSubmitToMeta = async (tpl) => {
    try {
      const res = await submitTemplate(tpl.id);
      // Update list with new status if returned
      const next = items.map((t) => (t.id === tpl.id ? { ...t, status: res?.status || 'submitted' } : t));
      dispatch(setTemplates(next));
      setToast({ message: `Submitted ${tpl.name} for approval`, type: 'success' });
    } catch (e) {
      setToast({ message: e?.message || 'Failed to submit template', type: 'error' });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing && editing.id) {
        const updated = await updateTemplate(editing.id, payload);
        const next = items.map((t) => (t.id === editing.id ? { ...editing, ...updated } : t));
        dispatch(setTemplates(next));
        setToast({ message: 'Template updated', type: 'success' });
      } else {
        const created = await createTemplate(payload);
        const createdWithDefaults = {
          status: 'draft',
          ...payload,
          ...created,
        };
        dispatch(setTemplates([createdWithDefaults, ...items]));
        setToast({ message: 'Template created', type: 'success' });
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      setToast({ message: e?.message || 'Failed to save template', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const refresh = async () => {
    try {
      const server = await listTemplates();
      dispatch(setTemplates(server));
      setToast({ message: 'Templates refreshed', type: 'info' });
    } catch (e) {
      setToast({ message: e?.message || 'Failed to refresh templates', type: 'error' });
    }
  };

  return (
    <div className="page" role="region" aria-label="Templates">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 12 }}>
        <div>
          <h1>Templates</h1>
          <p className="muted">Create and manage WhatsApp message templates. Submit to Meta for approval.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" onClick={refresh}>Refresh</Button>
          <Button variant="primary" onClick={handleCreate}>New Template</Button>
        </div>
      </div>

      <TemplateList
        items={items}
        loading={loading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSubmit={handleSubmitToMeta}
      />

      <Modal open={modalOpen} onClose={closeModal} title={title} size="lg" footer={null}>
        <TemplateForm
          initialValue={editing}
          onCancel={closeModal}
          onSubmit={handleFormSubmit}
          submitting={submitting}
        />
      </Modal>

      <div style={{ position: 'fixed', bottom: 20, right: 20, width: 360 }}>
        <Toast
          message={toast?.message}
          type={toast?.type || 'info'}
          onClose={() => setToast(null)}
        />
      </div>
    </div>
  );
}
