import React, { useMemo, useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import Select from '../common/Select';
import Tag from '../common/Tag';
import Toast from '../common/Toast';
import { useSelector } from 'react-redux';
import { submitTemplateForApproval } from '../../api/templatesApi';
import { fetchApprovalCategories } from '../../api/approvalsApi';

/**
 * SubmissionPanel
 * Allows users to choose a template and submit it for approval with a selected category.
 * Uses Ocean Professional theme styles via common components.
 */

// PUBLIC_INTERFACE
export default function SubmissionPanel({ onSubmitted }) {
  /** SubmissionPanel for sending templates to approval queue.
   * Props:
   *  - onSubmitted: function(templateId) called when submission succeeds
   */

  const templates = useSelector((state) => state.templates.items || []);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loadingCats, setLoadingCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Prepare template options
  const templateOptions = useMemo(() => {
    return templates.map(t => ({
      value: t.id,
      label: `${t.name} ${t.language ? '(' + t.language + ')' : ''}`,
    }));
  }, [templates]);

  const categoryOptions = useMemo(() => {
    return categories.map(c => ({ value: c, label: c }));
  }, [categories]);

  const handleLoadCategories = async () => {
    setLoadingCats(true);
    setToast(null);
    const controller = new AbortController();
    try {
      const data = await fetchApprovalCategories(controller.signal);
      setCategories(Array.isArray(data) ? data : (data?.categories || []));
      if (!selectedCategory && (Array.isArray(data) ? data.length : (data?.categories?.length || 0)) > 0) {
        setSelectedCategory((Array.isArray(data) ? data[0] : data.categories[0]));
      }
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Failed to load categories' });
    } finally {
      setLoadingCats(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTemplateId) {
      setToast({ type: 'error', message: 'Please select a template to submit.' });
      return;
    }
    setSubmitting(true);
    setToast(null);
    try {
      await submitTemplateForApproval(selectedTemplateId, { category: selectedCategory });
      setToast({ type: 'success', message: 'Template submitted for approval.' });
      onSubmitted && onSubmitted(selectedTemplateId);
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Failed to submit for approval' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#111827]">Submit for Approval</h3>
        <Tag color="blue">Approvals</Tag>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Template</label>
          <Select
            options={templateOptions}
            value={selectedTemplateId}
            onChange={(v) => setSelectedTemplateId(v)}
            placeholder="Select a template"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={(v) => setSelectedCategory(v)}
                placeholder={loadingCats ? 'Loading...' : 'Select or load categories'}
                disabled={loadingCats || categoryOptions.length === 0}
              />
            </div>
            <Button variant="secondary" onClick={handleLoadCategories} disabled={loadingCats}>
              {loadingCats ? 'Loading' : 'Load'}
            </Button>
          </div>
        </div>

        <div className="flex items-end">
          <Button onClick={handleSubmit} disabled={submitting || !selectedTemplateId} className="w-full">
            {submitting ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </div>
      </div>

      {toast && (
        <div className="mt-4">
          <Toast type={toast.type} message={toast.message} />
        </div>
      )}
    </Card>
  );
}
