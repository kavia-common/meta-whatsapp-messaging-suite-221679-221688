import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import messagingApi from '../../api/messagingApi';
import { showToast } from './uiSlice';

// PUBLIC_INTERFACE
export const sendCampaign = createAsyncThunk('messaging/sendCampaign', async (payload, { rejectWithValue, dispatch }) => {
  try {
    const res = await messagingApi.createCampaign(payload);
    dispatch(showToast({ type: 'success', message: 'Campaign started' }));
    return res;
  } catch (err) {
    const msg = err?.message || 'Failed to start campaign';
    dispatch(showToast({ type: 'error', message: msg }));
    return rejectWithValue(msg);
  }
});

// PUBLIC_INTERFACE
export const fetchDeliveryReport = createAsyncThunk('messaging/fetchDeliveryReport', async (campaignId, { rejectWithValue }) => {
  try {
    const res = await messagingApi.getCampaignReport(campaignId);
    return res;
  } catch (err) {
    return rejectWithValue(err?.message || 'Failed to fetch delivery report');
  }
});

const messagingSlice = createSlice({
  name: 'messaging',
  initialState: {
    lastCampaign: null,
    report: null,
    loading: { send: false, report: false },
    error: { send: null, report: null },
  },
  reducers: {
    // PUBLIC_INTERFACE
    resetReport(state) {
      /** Reset current delivery report state. */
      state.report = null;
      state.loading.report = false;
      state.error.report = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // send
      .addCase(sendCampaign.pending, (state) => {
        state.loading.send = true;
        state.error.send = null;
      })
      .addCase(sendCampaign.fulfilled, (state, action) => {
        state.loading.send = false;
        state.lastCampaign = action.payload || null;
      })
      .addCase(sendCampaign.rejected, (state, action) => {
        state.loading.send = false;
        state.error.send = action.payload || 'Failed to start campaign';
      })
      // report
      .addCase(fetchDeliveryReport.pending, (state) => {
        state.loading.report = true;
        state.error.report = null;
      })
      .addCase(fetchDeliveryReport.fulfilled, (state, action) => {
        state.loading.report = false;
        state.report = action.payload || null;
      })
      .addCase(fetchDeliveryReport.rejected, (state, action) => {
        state.loading.report = false;
        state.error.report = action.payload || 'Failed to fetch delivery report';
      });
  },
});

export const { resetReport } = messagingSlice.actions;
export default messagingSlice.reducer;
