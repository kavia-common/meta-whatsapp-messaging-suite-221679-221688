import httpClient from './httpClient';

/**
 * Messaging API client for campaign orchestration.
 * Endpoints:
 *  - POST /campaigns                -> create/start a campaign
 *  - GET /campaigns/:id             -> fetch campaign details & status
 *  - GET /campaigns/:id/report      -> fetch final delivery report
 */

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
  const res = await httpClient.post('/campaigns', payload);
  return res?.data?.data ?? res?.data ?? payload;
}

// PUBLIC_INTERFACE
export async function getCampaign(campaignId) {
  /** Fetch details for a campaign by id, including status and counters. */
  const res = await httpClient.get(`/campaigns/${campaignId}`);
  return res?.data?.data ?? res?.data ?? null;
}

// PUBLIC_INTERFACE
export async function getCampaignReport(campaignId) {
  /** Fetch final campaign delivery report by id. */
  const res = await httpClient.get(`/campaigns/${campaignId}/report`);
  return res?.data?.data ?? res?.data ?? null;
}

export default {
  createCampaign,
  getCampaign,
  getCampaignReport,
};
