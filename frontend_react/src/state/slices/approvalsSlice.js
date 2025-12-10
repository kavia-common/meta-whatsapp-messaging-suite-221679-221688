import httpClient from '../../api/httpClient';

const prefix = 'approvals';

const SET_LOADING = `${prefix}/SET_LOADING`;
const SET_PENDING = `${prefix}/SET_PENDING`;
const SET_ERROR = `${prefix}/SET_ERROR`;

const initialState = {
  pending: [],
  loading: false,
  error: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload, error: action.payload === true ? null : state.error };
    case SET_PENDING:
      return { ...state, pending: Array.isArray(action.payload) ? action.payload : [], loading: false, error: null };
    case SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function fetchApprovals() {
  /**
   * Async thunk to load pending approvals.
   * Placeholder endpoint: GET /approvals/pending
   */
  return async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await httpClient.get('/approvals/pending');
      dispatch({ type: SET_PENDING, payload: res?.data?.data || res?.data || [] });
    } catch (e) {
      dispatch({ type: SET_ERROR, payload: e?.message || 'Failed to load approvals' });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
}

export default {
  initialState,
  reducer,
  actions: { fetchApprovals },
  types: { SET_LOADING, SET_PENDING, SET_ERROR },
};
