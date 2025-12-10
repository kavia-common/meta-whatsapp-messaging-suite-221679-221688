import httpClient from '../../api/httpClient';

const prefix = 'auth';

const SET_LOADING = `${prefix}/SET_LOADING`;
const SET_USER = `${prefix}/SET_USER`;
const SET_ERROR = `${prefix}/SET_ERROR`;
const LOGOUT = `${prefix}/LOGOUT`;

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload, error: action.payload === true ? null : state.error };
    case SET_USER:
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false, error: null };
    case SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function fetchCurrentUser() {
  /**
   * Async thunk to get current user session.
   * Placeholder endpoint: GET /auth/me
   */
  return async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await httpClient.get('/auth/me');
      dispatch({ type: SET_USER, payload: res?.data?.data || res?.data || null });
    } catch (e) {
      dispatch({ type: SET_ERROR, payload: e?.message || 'Failed to fetch user' });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
}

// PUBLIC_INTERFACE
export function logout() {
  /**
   * Async thunk to log out user.
   * Placeholder endpoint: POST /auth/logout
   */
  return async (dispatch) => {
    try {
      await httpClient.post('/auth/logout');
    } catch (e) {
      // ignore errors on logout in placeholder
    } finally {
      dispatch({ type: LOGOUT });
    }
  };
}

export default {
  initialState,
  reducer,
  actions: { fetchCurrentUser, logout },
  types: { SET_LOADING, SET_USER, SET_ERROR, LOGOUT },
};
