import httpClient from './httpClient';

/**
 * Contacts API client
 * Endpoints:
 *  - GET    /contacts/lists             -> list contact lists
 *  - POST   /contacts/lists             -> create a new list
 *  - GET    /contacts/lists/:id         -> get list details (metadata + contacts)
 *  - PUT    /contacts/lists/:id         -> update list metadata
 *  - DELETE /contacts/lists/:id         -> delete a list
 *  - POST   /contacts/upload-csv        -> upload CSV file to create/update a list
 */

// Helper to build query strings
function toQuery(params = {}) {
  const url = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    url.append(k, String(v));
  });
  const s = url.toString();
  return s ? `?${s}` : '';
}

// PUBLIC_INTERFACE
export async function listContactLists(params = {}) {
  /** Fetch all contact lists. Optional params for filtering or pagination. */
  const qs = toQuery(params);
  return httpClient.get(`/contacts/lists${qs}`);
}

// PUBLIC_INTERFACE
export async function createContactList(payload) {
  /** Create a new contact list (metadata only). */
  if (!payload || typeof payload !== 'object') throw new Error('payload is required');
  return httpClient.post('/contacts/lists', payload);
}

// PUBLIC_INTERFACE
export async function getContactListDetails(listId) {
  /** Fetch details for a specific list including contacts. */
  if (!listId) throw new Error('listId is required');
  return httpClient.get(`/contacts/lists/${encodeURIComponent(listId)}`);
}

// PUBLIC_INTERFACE
export async function updateContactList(listId, payload) {
  /** Update metadata for a contact list. */
  if (!listId) throw new Error('listId is required');
  if (!payload || typeof payload !== 'object') throw new Error('payload is required');
  return httpClient.put(`/contacts/lists/${encodeURIComponent(listId)}`, payload);
}

// PUBLIC_INTERFACE
export async function deleteContactList(listId) {
  /** Delete a contact list by id. */
  if (!listId) throw new Error('listId is required');
  return httpClient.delete(`/contacts/lists/${encodeURIComponent(listId)}`);
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
  if (!file) throw new Error('file is required');

  // For multipart, override default JSON handling. Use the lower-level request via httpClient.post with headers override.
  const form = new FormData();
  form.append('file', file);
  if (listName) form.append('listName', listName);
  form.append('delimiter', delimiter);
  form.append('hasHeader', String(!!hasHeader));

  // Our httpClient will not stringify body if it's already FormData and content-type header is provided by browser automatically.
  return httpClient.post('/contacts/upload-csv', form, {
    headers: {}, // let browser set Content-Type with boundary
  });
}

export default {
  listContactLists,
  createContactList,
  getContactListDetails,
  updateContactList,
  deleteContactList,
  uploadContactsCsv,
};
