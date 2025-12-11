import React, { useEffect, useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import UploadContactsModal from '../components/contacts/UploadContactsModal';
import ContactLists from '../components/contacts/ContactLists';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactLists } from '../state/slices/contactsSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ContactsPage = () => {
  const dispatch = useDispatch();
  const lists = useSelector((s) => s.contacts.lists);
  const loading = useSelector((s) => s.contacts.loading.fetch);
  const error = useSelector((s) => s.contacts.error.fetch);
  const [open, setOpen] = useState(false);
  const [activeListId, setActiveListId] = useState(null);

  useEffect(() => {
    dispatch(fetchContactLists());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contacts</h2>
        <Button variant="primary" onClick={() => setOpen(true)}>Upload Contacts</Button>
      </div>
      <Card>
        {loading ? <LoadingSpinner /> : error ? <div className="text-red-600">{error}</div> : <ContactLists lists={lists} onSelectList={(id) => setActiveListId(id)} />}
      </Card>
      <UploadContactsModal open={open} onClose={() => setOpen(false)} listId={activeListId} />
    </div>
  );
};

export default ContactsPage;
