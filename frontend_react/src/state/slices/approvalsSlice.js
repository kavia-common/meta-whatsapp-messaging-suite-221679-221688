import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { submitForApproval as submitApprovalApi, fetchTemplateApprovalStatus } from '../../api/approvalsApi';
import { showToast } from './uiSlice';

// PUBLIC_INTERFACE
export const submitForApproval = createAsyncThunk('approvals/submitForApproval', async (templateId, { rejectWithValue, dispatch }) => {
  try {
    const res = await submitApprovalApi(templateId);
    dispatch(showToast({ type: 'success', message: 'Submitted for approval' }));
    return res;
  } catch (err) {
    const msg = err?.message || 'Failed to submit for approval';
    dispatch(showToast({ type: 'error', message: msg }));
    return rejectWithValue(msg);
  }
});

// PUBLIC_INTERFACE
export const fetchApprovalStatus = createAsyncThunk('approvals/fetchApprovalStatus', async (templateId, { rejectWithValue }) => {
  try {
    const res = await fetchTemplateApprovalStatus(templateId);
    return res;
  } catch (err) {
    return rejectWithValue(err?.message || 'Failed to fetch approval status');
  }
});

const approvalsSlice = createSlice({
  name: 'approvals',
  initialState: {
    submissions: [],
    loading: { submit: false, status: false },
    error: { submit: null, status: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // submit
      .addCase(submitForApproval.pending, (state) => {
        state.loading.submit = true;
        state.error.submit = null;
      })
      .addCase(submitForApproval.fulfilled, (state, action) => {
        state.loading.submit = false;
        if (action.payload) state.submissions.unshift(action.payload);
      })
      .addCase(submitForApproval.rejected, (state, action) => {
        state.loading.submit = false;
        state.error.submit = action.payload || 'Failed to submit for approval';
      })
      // status
      .addCase(fetchApprovalStatus.pending, (state) => {
        state.loading.status = true;
        state.error.status = null;
      })
      .addCase(fetchApprovalStatus.fulfilled, (state, action) => {
        state.loading.status = false;
        const idx = state.submissions.findIndex((s) => s.id === action.payload?.id);
        if (idx !== -1) state.submissions[idx] = action.payload;
      })
      .addCase(fetchApprovalStatus.rejected, (state, action) => {
        state.loading.status = false;
        state.error.status = action.payload || 'Failed to fetch approval status';
      });
  },
});

export default approvalsSlice.reducer;
