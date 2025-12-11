import httpClient from './httpClient';

/**
 * Approvals API module
 * Provides functions to fetch approval categories and template approval status.
 * Uses shared httpClient which is configured with base URL and normalized errors.
 */

// PUBLIC_INTERFACE
export async function fetchApprovalCategories({ signal } = {}) {
  /** Fetch approval categories for templates. */
  return httpClient.get('/approvals/categories', { signal });
}

// PUBLIC_INTERFACE
export async function fetchTemplateApprovalStatus(templateId, { signal } = {}) {
  /** Fetch approval status for a specific template by id. */
  if (!templateId) {
    throw new Error('templateId is required to fetch approval status');
  }
  return httpClient.get(`/approvals/${encodeURIComponent(templateId)}/status`, { signal });
}

// PUBLIC_INTERFACE
export async function requestApprovalRefresh(templateId) {
  /** Ask backend to refresh approval status from Meta for a template. */
  if (!templateId) {
    throw new Error('templateId is required');
  }
  return httpClient.post(`/approvals/${encodeURIComponent(templateId)}/refresh`);
}

// PUBLIC_INTERFACE
export async function submitForApproval(templateId, payload = {}) {
  /** Submit the template for approval through approvals endpoint (if backend separates it). */
  if (!templateId) {
    throw new Error('templateId is required');
  }
  return httpClient.post(`/approvals/${encodeURIComponent(templateId)}/submit`, payload);
}

export default {
  fetchApprovalCategories,
  fetchTemplateApprovalStatus,
  requestApprovalRefresh,
  submitForApproval,
};
