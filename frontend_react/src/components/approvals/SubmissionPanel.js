import React from 'react';
import Button from '../common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { submitForApproval } from '../../state/slices/approvalsSlice';

const SubmissionPanel = ({ template }) => {
  const dispatch = useDispatch();
  const submitting = useSelector((s) => s.approvals.loading.submit);

  const submit = async () => {
    await dispatch(submitForApproval(template.id));
  };

  return (
    <div className="flex gap-2">
      <Button variant="primary" onClick={submit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit for Approval'}
      </Button>
    </div>
  );
};

export default SubmissionPanel;
