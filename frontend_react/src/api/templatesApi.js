import httpClient from './httpClient';

/**
 * Templates API client
 * Provides CRUD operations and submission to Meta approval endpoints.
 * Uses the shared axios httpClient with env-based baseURL.
 */

// PUBLIC_INTERFACE
export async function listTemplates(params = {}) {
  /** Fetch all templates. Optional params for filtering or pagination. */
  const res = await httpClient.get('/templates', { params });
  return res?.data?.data ?? res?.data ?? [];
}

// PUBLIC_INTERFACE
export async function getTemplate(id) {
  /** Fetch a single template by id. */
  const res = await httpClient.get(`/templates/${id}`);
  return res?.data?.data ?? res?.data ?? null;
}

// PUBLIC_INTERFACE
export async function createTemplate(payload) {
  /** Create a new template. Payload contains name, category, language, components, variables. */
  const res = await httpClient.post('/templates', payload);
  return res?.data?.data ?? res?.data ?? payload;
}

// PUBLIC_INTERFACE
export async function updateTemplate(id, payload) {
  /** Update an existing template by id. */
  const res = await httpClient.put(`/templates/${id}`, payload);
  return res?.data?.data ?? res?.data ?? { id, ...payload };
}

// PUBLIC_INTERFACE
export async function deleteTemplate(id) {
  /** Delete a template by id. */
  const res = await httpClient.delete(`/templates/${id}`);
  return res?.data?.data ?? res?.data ?? { ok: true, id };
}

// PUBLIC_INTERFACE
export async function submitTemplate(id) {
  /** Submit a template for Meta approval. */
  const res = await httpClient.post(`/templates/${id}/submit`);
  return res?.data?.data ?? res?.data ?? { ok: true, id, status: 'submitted' };
}

export default {
  listTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  submitTemplate,
};
