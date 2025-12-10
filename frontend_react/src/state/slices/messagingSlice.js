import httpClient from '../../api/httpClient';

const prefix = 'messaging';

const SET_SENDING = `${prefix}/SET_SENDING`;
const SET_ERROR = `${prefix}/SET_ERROR`;
const ADD_TO_QUEUE = `${prefix}/ADD_TO_QUEUE`;
const ADD_HISTORY = `${prefix}/ADD_HISTORY`;

const initialState = {
  queue: [],
  history: [],
  sending: false,
  error: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SENDING:
      return { ...state, sending: action.payload, error: action.payload === true ? null : state.error };
    case SET_ERROR:
      return { ...state, error: action.payload, sending: false };
    case ADD_TO_QUEUE:
      return { ...state, queue: [...state.queue, action.payload] };
    case ADD_HISTORY:
      return { ...state, history: [action.payload, ...state.history] };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function sendBulkMessage({ templateId, contactIds, variables }) {
  /**
   * Async thunk to send a bulk message.
   * Placeholder endpoint: POST /messages/send
   * Body: { templateId, contactIds, variables }
   */
  return async (dispatch) => {
    const payload = { templateId, contactIds, variables };
    dispatch({ type: ADD_TO_QUEUE, payload });
    dispatch({ type: SET_SENDING, payload: true });
    try {
      const res = await httpClient.post('/messages/send', payload);
      dispatch({ type: ADD_HISTORY, payload: res?.data || { ok: true, ...payload, ts: Date.now() } });
    } catch (e) {
      dispatch({ type: SET_ERROR, payload: e?.message || 'Failed to send messages' });
    } finally {
      dispatch({ type: SET_SENDING, payload: false });
    }
  };
}

export default {
  initialState,
  reducer,
  actions: { sendBulkMessage },
  types: { SET_SENDING, SET_ERROR, ADD_TO_QUEUE, ADD_HISTORY },
};
