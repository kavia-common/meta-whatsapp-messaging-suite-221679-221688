import httpClient from './httpClient';

/**
 * Messaging API client for campaign orchestration.
 * Endpoints:
 *  - GET  /campaigns                -> list campaigns
 *  - POST /campaigns                -> create/start a campaign
 *  - GET  /campaigns/:id            -> fetch campaign details & status
 *  - POST /campaigns/:id/cancel     -> cancel a running/scheduled campaign
 *  - GET  /campaigns/:id/report     -> fetch final delivery report
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
export async function listCampaigns(params = {}) {
  /** List campaigns with optional filters/pagination. */
  const qs = toQuery(params);
  return httpClient.get(`/campaigns${qs}`);
}

// PUBLIC_INTERFACE
export async function createCampaign(payload) {
  /**
   * Create a campaign.
   * payload: {
   *   templateId: string,
   *   contactListId: string,
   *   variables?: object,
   *   schedule?: { type: 'now' | 'later', at?: string (ISO) }
   * }
   */
  if (!payload || typeof payload !== 'object') throw new Error('payload is required');
  return httpClient.post('/campaigns', payload);
}

// PUBLIC_INTERFACE
export async function getCampaign(campaignId) {
  /** Fetch details for a campaign by id, including status and counters. */
  if (!campaignId) throw new Error('campaignId is required');
  return httpClient.get(`/campaigns/${encodeURIComponent(campaignId)}`);
}

// PUBLIC_INTERFACE
export async function cancelCampaign(campaignId) {
  /** Cancel a running/scheduled campaign by id. */
  if (!campaignId) throw new Error('campaignId is required');
  return httpClient.post(`/campaigns/${encodeURIComponent(campaignId)}/cancel`);
}

// PUBLIC_INTERFACE
export async function getCampaignReport(campaignId) {
  /** Fetch final campaign delivery report by id. */
  if (!campaignId) throw new Error('campaignId is required');
  return httpClient.get(`/campaigns/${encodeURIComponent(campaignId)}/report`);
}

export default {
  listCampaigns,
  createCampaign,
  getCampaign,
  cancelCampaign,
  getCampaignReport,
};
