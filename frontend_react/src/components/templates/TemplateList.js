import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTemplate } from '../../state/slices/templatesSlice';
import Button from '../common/Button';
import Card from '../common/Card';

const TemplateList = ({ templates = [], onEdit }) => {
  const dispatch = useDispatch();
  const deleting = useSelector((s) => s.templates.loading.delete);

  const handleDelete = async (id) => {
    await dispatch(deleteTemplate(id));
  };

  return (
    <div className="space-y-3">
      {templates.map((t) => (
        <Card key={t.id} className="flex items-center justify-between">
          <div>
            <div className="font-medium">{t.name}</div>
            <div className="text-sm text-gray-500">{t.content?.slice(0, 120)}</div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onEdit(t)} variant="secondary">Edit</Button>
            <Button onClick={() => handleDelete(t.id)} variant="danger" disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TemplateList;
