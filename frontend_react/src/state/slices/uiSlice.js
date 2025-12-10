const prefix = 'ui';

const SET_THEME = `${prefix}/SET_THEME`;
const SET_TOAST = `${prefix}/SET_TOAST`;
const CLEAR_TOAST = `${prefix}/CLEAR_TOAST`;

const initialState = {
  theme: 'light',
  toast: null, // { message, type }
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.payload || 'light' };
    case SET_TOAST:
      return { ...state, toast: action.payload || null };
    case CLEAR_TOAST:
      return { ...state, toast: null };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function setTheme(theme) {
  /** Sets UI theme (light|dark). */
  return { type: SET_THEME, payload: theme };
}

// PUBLIC_INTERFACE
export function showToast(message, type = 'info') {
  /** Shows a global toast payload. */
  return { type: SET_TOAST, payload: { message, type } };
}

// PUBLIC_INTERFACE
export function clearToast() {
  /** Clears current toast. */
  return { type: CLEAR_TOAST };
}

export default {
  initialState,
  reducer,
  actions: { setTheme, showToast, clearToast },
  types: { SET_THEME, SET_TOAST, CLEAR_TOAST },
};
