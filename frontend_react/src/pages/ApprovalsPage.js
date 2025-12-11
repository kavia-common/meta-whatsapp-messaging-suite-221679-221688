import React from 'react';
import Card from '../components/common/Card';
import SubmissionPanel from '../components/approvals/SubmissionPanel';
import { useSelector } from 'react-redux';

const ApprovalsPage = () => {
  const templates = useSelector((s) => s.templates.items);
  const submitting = useSelector((s) => s.approvals.loading.submit);
  const submitErr = useSelector((s) => s.approvals.error.submit);

  return (
    <div className="space-y-4">
      {templates.map((t) => (
        <Card key={t.id}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-600">{t.content?.slice(0, 100)}</div>
            </div>
            <SubmissionPanel template={t} />
          </div>
        </Card>
      ))}
      {submitting && <div className="text-sm text-gray-600 px-2">Submitting template for approval...</div>}
      {submitErr && <div className="text-sm text-red-600 px-2">{submitErr}</div>}
    </div>
  );
};

export default ApprovalsPage;
