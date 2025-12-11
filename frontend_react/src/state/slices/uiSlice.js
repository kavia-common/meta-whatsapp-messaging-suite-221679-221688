import { createSlice, nanoid } from '@reduxjs/toolkit';

/**
 * PUBLIC_INTERFACE
 * uiSlice handles global UI state including toast notifications.
 * Exposes actions: showToast, hideToast, clearToasts; and selector: selectToasts.
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [], // {id, type: 'success'|'error'|'info', message}
  },
  reducers: {
    // PUBLIC_INTERFACE
    showToast: {
      /**
       * Show a toast notification.
       * payload: { type: 'success'|'error'|'info', message: string, id?: string }
       */
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare(payload) {
        return { payload: { id: payload?.id || nanoid(), type: payload?.type || 'info', message: payload?.message || '' } };
      },
    },
    // PUBLIC_INTERFACE
    hideToast(state, action) {
      /** Hide a toast by id. payload: string (id) */
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    // PUBLIC_INTERFACE
    clearToasts(state) {
      /** Clear all toasts. */
      state.toasts = [];
    },
  },
});

// PUBLIC_INTERFACE
export const { showToast, hideToast, clearToasts } = uiSlice.actions;

// PUBLIC_INTERFACE
export const selectToasts = (state) => state.ui.toasts;

export default uiSlice.reducer;
