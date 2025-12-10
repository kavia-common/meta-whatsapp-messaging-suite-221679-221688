import React, { useMemo, useState } from 'react';
import SubmissionPanel from '../components/approvals/SubmissionPanel';
import ApprovalStatus from '../components/approvals/ApprovalStatus';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import { useSelector } from 'react-redux';

/**
 * ApprovalsPage
 * Allows submitting templates for approval and checking their approval statuses.
 * Styled following the Ocean Professional theme via shared components.
 */
// PUBLIC_INTERFACE
export default function ApprovalsPage() {
  const templates = useSelector((state) => state.templates.items || []);
  const approvals = useSelector((state) => state.approvals?.items || []); // placeholder if slice is present
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const columns = useMemo(() => ([
    { header: 'Name', accessor: 'name' },
    { header: 'Language', accessor: 'language' },
    { header: 'Category', accessor: 'category' },
    { header: 'Status', accessor: 'status' },
    { header: 'Actions', accessor: 'actions' },
  ]), []);

  const rows = useMemo(() => {
    const approvalById = {};
    approvals.forEach(a => { approvalById[a.templateId] = a; });
    return templates.map(t => {
      const a = approvalById[t.id];
      return {
        id: t.id,
        name: t.name,
        language: t.language || '-',
        category: t.category || a?.category || '-',
        status: a?.status || t.status || 'draft',
        actions: (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setSelectedTemplateId(t.id)}>View Status</Button>
          </div>
        ),
      };
    });
  }, [templates, approvals]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Approvals</h2>
        <p className="text-sm text-gray-600">Submit templates for Meta review and track their approval status.</p>
      </div>

      <SubmissionPanel onSubmitted={(tid) => setSelectedTemplateId(tid)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#111827]">Templates</h3>
              <p className="text-sm text-gray-600">Select a template to view its current approval status.</p>
            </div>
            <Table columns={columns} data={rows} rowKey="id" />
          </Card>
        </div>
        <div className="lg:col-span-1">
          <ApprovalStatus templateId={selectedTemplateId} autoRefreshMs={0} />
        </div>
      </div>
    </div>
  );
}
