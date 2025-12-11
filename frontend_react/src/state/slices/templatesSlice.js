import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { templatesApi } from '../../api/templatesApi';
import { showToast } from './uiSlice';

// PUBLIC_INTERFACE
export const fetchTemplates = createAsyncThunk('templates/fetchTemplates', async (_, { rejectWithValue }) => {
  try {
    const res = await templatesApi.getTemplates();
    return res || [];
  } catch (err) {
    return rejectWithValue(err?.message || 'Failed to fetch templates');
  }
});

// PUBLIC_INTERFACE
export const createTemplate = createAsyncThunk('templates/createTemplate', async (payload, { rejectWithValue, dispatch }) => {
  try {
    const res = await templatesApi.createTemplate(payload);
    dispatch(showToast({ type: 'success', message: 'Template created successfully' }));
    return res;
  } catch (err) {
    const msg = err?.message || 'Failed to create template';
    dispatch(showToast({ type: 'error', message: msg }));
    return rejectWithValue(msg);
  }
});

// PUBLIC_INTERFACE
export const updateTemplate = createAsyncThunk('templates/updateTemplate', async ({ id, data }, { rejectWithValue, dispatch }) => {
  try {
    const res = await templatesApi.updateTemplate(id, data);
    dispatch(showToast({ type: 'success', message: 'Template updated successfully' }));
    return res;
  } catch (err) {
    const msg = err?.message || 'Failed to update template';
    dispatch(showToast({ type: 'error', message: msg }));
    return rejectWithValue(msg);
  }
});

// PUBLIC_INTERFACE
export const deleteTemplate = createAsyncThunk('templates/deleteTemplate', async (id, { rejectWithValue, dispatch }) => {
  try {
    await templatesApi.deleteTemplate(id);
    dispatch(showToast({ type: 'success', message: 'Template deleted' }));
    return { id };
  } catch (err) {
    const msg = err?.message || 'Failed to delete template';
    dispatch(showToast({ type: 'error', message: msg }));
    return rejectWithValue(msg);
  }
});

const templatesSlice = createSlice({
  name: 'templates',
  initialState: {
    items: [],
    loading: { fetch: false, create: false, update: false, delete: false },
    error: { fetch: null, create: null, update: null, delete: null },
  },
  reducers: {
    // PUBLIC_INTERFACE
    setTemplates(state, action) {
      /** Replace templates list synchronously. */
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchTemplates.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.items = action.payload || [];
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload || 'Failed to fetch templates';
      })
      // create
      .addCase(createTemplate.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading.create = false;
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload || 'Failed to create template';
      })
      // update
      .addCase(updateTemplate.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading.update = false;
        const idx = state.items.findIndex((t) => t.id === action.payload?.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload || 'Failed to update template';
      })
      // delete
      .addCase(deleteTemplate.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.items = state.items.filter((t) => t.id !== action.payload?.id);
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload || 'Failed to delete template';
      });
  },
});

export const { setTemplates } = templatesSlice.actions;
export default templatesSlice.reducer;
