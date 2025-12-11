import { configureStore } from '@reduxjs/toolkit';
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

export default store;
