import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import contactsApi from '../../api/contactsApi';
import { showToast } from './uiSlice';

// PUBLIC_INTERFACE
export const fetchContactLists = createAsyncThunk('contacts/fetchContactLists', async (_, { rejectWithValue }) => {
  try {
    const res = await contactsApi.listContactLists();
    return Array.isArray(res) ? res : (res?.items || []);
  } catch (err) {
    return rejectWithValue(err?.message || 'Failed to fetch contact lists');
  }
});

// PUBLIC_INTERFACE
export const createContactList = createAsyncThunk('contacts/createContactList', async (payload, { rejectWithValue, dispatch }) => {
  try {
    const res = await contactsApi.createContactList(payload);
    dispatch(showToast({ type: 'success', message: 'Contact list created' }));
    return res;
  } catch (err) {
    const msg = err?.message || 'Failed to create contact list';
    dispatch(showToast({ type: 'error', message: msg }));
    return rejectWithValue(msg);
  }
});

// PUBLIC_INTERFACE
export const uploadContacts = createAsyncThunk('contacts/uploadContacts', async ({ file, listName, delimiter, hasHeader }, { rejectWithValue, dispatch }) => {
  try {
    const res = await contactsApi.uploadContactsCsv({ file, listName, delimiter, hasHeader });
    dispatch(showToast({ type: 'success', message: `Uploaded ${res?.added || 0} contacts` }));
    return { listName, res };
  } catch (err) {
    const msg = err?.message || 'Failed to upload contacts';
    dispatch(showToast({ type: 'error', message: msg }));
    return rejectWithValue(msg);
  }
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    lists: [],
    loading: { fetch: false, create: false, upload: false },
    error: { fetch: null, create: null, upload: null },
  },
  reducers: {
    // PUBLIC_INTERFACE
    setContacts(state, action) {
      /** Replace contact lists synchronously. */
      state.lists = Array.isArray(action.payload) ? action.payload : [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch lists
      .addCase(fetchContactLists.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchContactLists.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.lists = action.payload || [];
      })
      .addCase(fetchContactLists.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload || 'Failed to fetch contact lists';
      })
      // create list
      .addCase(createContactList.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createContactList.fulfilled, (state, action) => {
        state.loading.create = false;
        if (action.payload) state.lists.unshift(action.payload);
      })
      .addCase(createContactList.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload || 'Failed to create contact list';
      })
      // upload contacts
      .addCase(uploadContacts.pending, (state) => {
        state.loading.upload = true;
        state.error.upload = null;
      })
      .addCase(uploadContacts.fulfilled, (state, action) => {
        state.loading.upload = false;
        const idx = state.lists.findIndex((l) => l.id === action.payload?.listId);
        if (idx !== -1) state.lists[idx].count = (state.lists[idx].count || 0) + (action.payload?.res?.added || 0);
      })
      .addCase(uploadContacts.rejected, (state, action) => {
        state.loading.upload = false;
        state.error.upload = action.payload || 'Failed to upload contacts';
      });
  },
});

export const { setContacts } = contactsSlice.actions;
export default contactsSlice.reducer;
