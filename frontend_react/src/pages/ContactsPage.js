import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../state/store';
import { fetchContacts, setContacts } from '../state/slices/contactsSlice';
import ContactLists from '../components/contacts/ContactLists';
import ContactListDetails from '../components/contacts/ContactListDetails';
import UploadContactsModal from '../components/contacts/UploadContactsModal';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { listContactLists, getContactListDetails, uploadContactsCsv } from '../api/contactsApi';
import Button from '../components/common/Button';

/**
 * ContactsPage - Manage contact lists: list, details, upload CSV with preview.
 * Integrates with global contacts slice when present.
 */
// PUBLIC_INTERFACE
export default function ContactsPage() {
  const { state, dispatch } = useStore();
  const items = state.contacts?.items || [];
  const loading = state.contacts?.loading || false;

  const [selectedList, setSelectedList] = useState(null);
  const [details, setDetails] = useState({ list: null, contacts: [], loading: false });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Initial load via slice
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const headerActions = useMemo(() => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="outline" onClick={() => refreshLists()}>Refresh</Button>
      <Button variant="primary" onClick={() => setUploadOpen(true)}>Upload CSV</Button>
    </div>
  ), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function refreshLists() {
    try {
      const server = await listContactLists();
      dispatch(setContacts(server));
      setToast({ message: 'Contact lists refreshed', type: 'info' });
    } catch (e) {
      setToast({ message: e?.message || 'Failed to refresh contact lists', type: 'error' });
    }
  }

  async function openDetails(list) {
    setSelectedList(list);
    setDetails((d) => ({ ...d, loading: true }));
    try {
      const res = await getContactListDetails(list?.id);
      const normalizedContacts = Array.isArray(res?.contacts) ? res.contacts : (Array.isArray(res) ? res : []);
      setDetails({ list: res?.list || list, contacts: normalizedContacts, loading: false });
    } catch (e) {
      setToast({ message: e?.message || 'Failed to fetch list details', type: 'error' });
      setDetails({ list, contacts: [], loading: false });
    }
  }

  async function handleUpload({ file, listName, delimiter, hasHeader }) {
    try {
      const res = await uploadContactsCsv({ file, listName, delimiter, hasHeader });
      setUploadOpen(false);
      // If API returns created/updated list, merge or refresh
      if (res?.list) {
        const next = [res.list, ...items.filter((l) => l.id !== res.list.id)];
        dispatch(setContacts(next));
      } else {
        // fallback: full refresh
        await refreshLists();
      }
      setToast({ message: `Uploaded CSV to list "${listName}"`, type: 'success' });
    } catch (e) {
      setToast({ message: e?.message || 'Failed to upload CSV', type: 'error' });
    }
  }

  function closeDetails() {
    setSelectedList(null);
    setDetails({ list: null, contacts: [], loading: false });
  }

  return (
    <div className="page" role="region" aria-label="Contacts">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 12 }}>
        <div>
          <h1>Contacts</h1>
          <p className="muted">Manage contact lists and segments. Upload CSV and review details.</p>
        </div>
        {headerActions}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedList ? '1.2fr 1fr' : '1fr', gap: 12 }}>
        <div>
          <ContactLists
            items={items}
            loading={loading}
            onRefresh={refreshLists}
            onUpload={() => setUploadOpen(true)}
            onSelect={openDetails}
          />
        </div>

        {selectedList ? (
          <div>
            <ContactListDetails
              list={details.list || selectedList}
              contacts={details.contacts}
              loading={details.loading}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <Button variant="ghost" onClick={closeDetails}>Close</Button>
            </div>
          </div>
        ) : null}
      </div>

      <UploadContactsModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />

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
