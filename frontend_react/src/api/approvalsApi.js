import httpClient from './httpClient';

/**
 * Approvals API module
 * Provides functions to fetch approval categories and template approval status.
 * Uses shared httpClient which is configured with base URL and interceptors.
 */

// PUBLIC_INTERFACE
export async function fetchApprovalCategories(signal) {
  /** Fetch approval categories for templates.
   * Returns: Promise<{data: string[]}>
   */
  return httpClient.get('/approvals/categories', { signal }).then(res => res.data);
}

// PUBLIC_INTERFACE
export async function fetchTemplateApprovalStatus(templateId, signal) {
  /** Fetch approval status for a specific template by id.
   * Params:
   *  - templateId: string
   * Returns: Promise<{status: string, lastUpdated: string, reason?: string}>
   */
  if (!templateId) {
    throw new Error('templateId is required to fetch approval status');
  }
  return httpClient.get(`/approvals/${encodeURIComponent(templateId)}/status`, { signal }).then(res => res.data);
}
