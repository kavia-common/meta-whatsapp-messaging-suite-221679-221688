import React, { createContext, useContext, useMemo, useReducer } from 'react';
import templatesSlice from './slices/templatesSlice';
import contactsSlice from './slices/contactsSlice';
import messagingSlice from './slices/messagingSlice';
import approvalsSlice from './slices/approvalsSlice';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';

/**
 * Lightweight global store using React Context + useReducer.
 * - Combines slice reducers and initial states.
 * - Supports async thunks: any action that is a function gets executed with (dispatch, getState).
 */

// Root initial state from slices
const initialState = {
  templates: templatesSlice.initialState,
  contacts: contactsSlice.initialState,
  messaging: messagingSlice.initialState,
  approvals: approvalsSlice.initialState,
  auth: authSlice.initialState,
  ui: uiSlice.initialState,
};

// Root reducer combines slices. Each slice must export "reducer".
function rootReducer(state, action) {
  return {
    templates: templatesSlice.reducer(state.templates, action),
    contacts: contactsSlice.reducer(state.contacts, action),
    messaging: messagingSlice.reducer(state.messaging, action),
    approvals: approvalsSlice.reducer(state.approvals, action),
    auth: authSlice.reducer(state.auth, action),
    ui: uiSlice.reducer(state.ui, action),
  };
}

const StoreContext = createContext(undefined);

// PUBLIC_INTERFACE
export function StoreProvider({ children }) {
  /** Provides the global store context with dispatch that supports thunks. */
  const [state, baseDispatch] = useReducer(rootReducer, initialState);

  const getState = () => state;

  const dispatch = (action) => {
    if (typeof action === 'function') {
      // Thunk-like action
      return action(dispatch, getState);
    }
    return baseDispatch(action);
  };

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/**
 * Hook to access the global store
 */
// PUBLIC_INTERFACE
export function useStore() {
  /** Returns { state, dispatch } from the store context. */
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}

// Convenience selectors (optional)
// PUBLIC_INTERFACE
export const selectors = {
  templatesCount: (s) => s.templates?.items?.length || 0,
  contactsCount: (s) => s.contacts?.items?.length || 0,
  pendingApprovalsCount: (s) => s.approvals?.pending?.length || 0,
};

export default {
  StoreProvider,
  useStore,
  selectors,
};
