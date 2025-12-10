import httpClient from '../../api/httpClient';

const prefix = 'contacts';

const SET_LOADING = `${prefix}/SET_LOADING`;
const SET_ITEMS = `${prefix}/SET_ITEMS`;
const SET_ERROR = `${prefix}/SET_ERROR`;

const initialState = {
  items: [],
  loading: false,
  error: null,
};

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
export function fetchContacts() {
  /**
   * Async thunk to load contacts.
   * Placeholder endpoint: GET /contacts
   */
  return async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await httpClient.get('/contacts');
      dispatch({ type: SET_ITEMS, payload: res?.data?.data || res?.data || [] });
    } catch (e) {
      dispatch({ type: SET_ERROR, payload: e?.message || 'Failed to load contacts' });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
}

// PUBLIC_INTERFACE
export function setContacts(items) {
  /** Synchronous setter for contacts list. */
  return { type: SET_ITEMS, payload: items };
}

export default {
  initialState,
  reducer,
  actions: { fetchContacts, setContacts },
  types: { SET_LOADING, SET_ITEMS, SET_ERROR },
};
