import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import TextArea from '../common/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import { uploadContacts } from '../../state/slices/contactsSlice';
import { parseCsv } from '../../utils/csvParser';

const UploadContactsModal = ({ open, onClose, listId }) => {
  const [csv, setCsv] = useState('');
  const dispatch = useDispatch();
  const uploading = useSelector((s) => s.contacts.loading.upload);

  const onUpload = async () => {
    const parsed = parseCsv(csv, { delimiter: ',', header: true, limitRows: 0 });
    // Convert parsed rows to [{name, phone}, ...] assuming headers [name, phone]
    const headerIdx = {
      name: parsed.headers.findIndex(h => h.toLowerCase() === 'name'),
      phone: parsed.headers.findIndex(h => h.toLowerCase() === 'phone'),
    };
    const contacts = parsed.rows.map(r => ({
      name: headerIdx.name >= 0 ? r[headerIdx.name] : r[0],
      phone: headerIdx.phone >= 0 ? r[headerIdx.phone] : r[1],
    })).filter(c => c.phone);

    const res = await dispatch(uploadContacts({ listId, contacts }));
    if (res?.meta?.requestStatus === 'fulfilled') onClose && onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload Contacts">
      <div className="space-y-3">
        <TextArea rows={8} value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="Paste CSV content (name,phone)" />
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={uploading}>Cancel</Button>
          <Button variant="primary" onClick={onUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadContactsModal;
