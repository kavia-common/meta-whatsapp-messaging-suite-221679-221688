import httpClient from './httpClient';

/**
 * Templates API client
 * Provides CRUD operations and submission to Meta approval endpoints.
 * Uses the shared fetch-based httpClient with env-based baseURL and normalized errors.
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
export async function listTemplates(params = {}) {
  /** Fetch all templates. Optional params for filtering or pagination. */
  const qs = toQuery(params);
  return httpClient.get(`/templates${qs}`);
}

// PUBLIC_INTERFACE
export async function getTemplate(id) {
  /** Fetch a single template by id. */
  if (!id) throw new Error('Template id is required');
  return httpClient.get(`/templates/${encodeURIComponent(id)}`);
}

// PUBLIC_INTERFACE
export async function createTemplate(payload) {
  /** Create a new template. Payload contains name, category, language, components, variables. */
  if (!payload || typeof payload !== 'object') throw new Error('payload is required');
  return httpClient.post('/templates', payload);
}

// PUBLIC_INTERFACE
export async function updateTemplate(id, payload) {
  /** Update an existing template by id. */
  if (!id) throw new Error('Template id is required');
  if (!payload || typeof payload !== 'object') throw new Error('payload is required');
  return httpClient.put(`/templates/${encodeURIComponent(id)}`, payload);
}

// PUBLIC_INTERFACE
export async function deleteTemplate(id) {
  /** Delete a template by id. */
  if (!id) throw new Error('Template id is required');
  return httpClient.delete(`/templates/${encodeURIComponent(id)}`);
}

// PUBLIC_INTERFACE
export async function submitTemplate(id, options = {}) {
  /** Submit a template for Meta approval. Optional options may include category. */
  if (!id) throw new Error('Template id is required');
  return httpClient.post(`/templates/${encodeURIComponent(id)}/submit`, options);
}

// PUBLIC_INTERFACE
export async function cloneTemplate(id, newName) {
  /** Clone an existing template to a new one (if supported by backend). */
  if (!id) throw new Error('Template id is required');
  if (!newName) throw new Error('newName is required');
  return httpClient.post(`/templates/${encodeURIComponent(id)}/clone`, { name: newName });
}

export async function submitTemplateForApproval(id, payload = {}) {
  /** Back-compat wrapper for older callers; forwards to submitTemplate. */
  return submitTemplate(id, payload);
}

export default {
  listTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  submitTemplate,
  cloneTemplate,
  submitTemplateForApproval,
};
