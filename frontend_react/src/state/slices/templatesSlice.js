import httpClient from '../../api/httpClient';

const prefix = 'templates';

// Action types
const SET_LOADING = `${prefix}/SET_LOADING`;
const SET_ITEMS = `${prefix}/SET_ITEMS`;
const SET_ERROR = `${prefix}/SET_ERROR`;

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Reducer
function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload, error: action.payload === true ? null : state.error };
    case SET_ITEMS:
      return { ...state, items: Array.isArray(action.payload) ? action.payload : [], loading: false, error: null };
    case SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function fetchTemplates() {
  /**
   * Async thunk to load templates from server.
   * Placeholder endpoint: GET /templates
   */
  return async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await httpClient.get('/templates');
      dispatch({ type: SET_ITEMS, payload: res?.data?.data || res?.data || [] });
    } catch (e) {
      dispatch({ type: SET_ERROR, payload: e?.message || 'Failed to load templates' });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
}

// PUBLIC_INTERFACE
export function setTemplates(items) {
  /** Synchronous setter to replace templates list. */
  return { type: SET_ITEMS, payload: items };
}

export default {
  initialState,
  reducer,
  actions: { fetchTemplates, setTemplates },
  types: { SET_LOADING, SET_ITEMS, SET_ERROR },
};
