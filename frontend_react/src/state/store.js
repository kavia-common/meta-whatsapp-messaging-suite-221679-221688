import { configureStore } from '@reduxjs/toolkit';
import { useStore as useReduxStore } from 'react-redux';
import templatesReducer from './slices/templatesSlice';
import contactsReducer from './slices/contactsSlice';
import messagingReducer from './slices/messagingSlice';
import approvalsReducer from './slices/approvalsSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    templates: templatesReducer,
    contacts: contactsReducer,
    messaging: messagingReducer,
    approvals: approvalsReducer,
    auth: authReducer,
    ui: uiReducer,
  },
});

// PUBLIC_INTERFACE
export function useStore() {
  /** Return the Redux store instance via react-redux useStore hook. */
  return useReduxStore();
}

// PUBLIC_INTERFACE
export const selectors = {
  /** Root-level selectors for convenience */
  // Auth
  isAuthenticated: (state) => !!state?.auth?.isAuthenticated,
  currentUser: (state) => state?.auth?.user || null,
  // Templates
  templates: (state) => state?.templates?.items || [],
  // Contacts
  contactLists: (state) => state?.contacts?.lists || [],
  // Messaging
  lastCampaign: (state) => state?.messaging?.lastCampaign || null,
  report: (state) => state?.messaging?.report || null,
  // UI
  toast: (state) => state?.ui?.toast || null,
};

export default store;
