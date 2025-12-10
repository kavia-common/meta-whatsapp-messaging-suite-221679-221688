import httpClient from './httpClient';

/**
 * Contacts API client
 * Endpoints:
 *  - GET /contacts/lists           -> list contact lists
 *  - GET /contacts/lists/:id       -> get list details (metadata + contacts)
 *  - POST /contacts/upload-csv     -> upload CSV file to create/update a list
 */

// PUBLIC_INTERFACE
export async function listContactLists(params = {}) {
  /** Fetch all contact lists. Optional params for filtering or pagination. */
  const res = await httpClient.get('/contacts/lists', { params });
  return res?.data?.data ?? res?.data ?? [];
}

// PUBLIC_INTERFACE
export async function getContactListDetails(listId) {
  /** Fetch details for a specific list including contacts. */
  const res = await httpClient.get(`/contacts/lists/${listId}`);
  return res?.data?.data ?? res?.data ?? null;
}

// PUBLIC_INTERFACE
export async function uploadContactsCsv({ file, listName, delimiter = ',', hasHeader = true }) {
  /**
   * Upload a CSV file to create or update a contact list.
   * Body (multipart/form-data):
   *   file: CSV binary
   *   listName: target list name
   *   delimiter: , ; \t
   *   hasHeader: boolean
   */
  const form = new FormData();
  form.append('file', file);
  if (listName) form.append('listName', listName);
  form.append('delimiter', delimiter);
  form.append('hasHeader', String(!!hasHeader));

  const res = await httpClient.post('/contacts/upload-csv', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res?.data?.data ?? res?.data ?? { ok: true };
}

export default {
  listContactLists,
  getContactListDetails,
  uploadContactsCsv,
};
