import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSession as getSessionApi, logout as logoutApi } from '../../api/authApi';
import { showToast } from './uiSlice';

// PUBLIC_INTERFACE
export const login = createAsyncThunk('auth/login', async (_payload, { rejectWithValue, dispatch }) => {
  try {
    // For this codebase, login happens via redirect flow; get session post-login
    const res = await getSessionApi();
    if (res?.authenticated) {
      dispatch(showToast({ type: 'success', message: 'Logged in successfully' }));
      return { user: res.user, token: null };
    }
    const msg = 'Login failed';
    dispatch(showToast({ type: 'error', message: msg }));
    return rejectWithValue(msg);
  } catch (err) {
    const msg = err?.message || 'Login failed';
    dispatch(showToast({ type: 'error', message: msg }));
    return rejectWithValue(msg);
  }
});

// PUBLIC_INTERFACE
export const fetchSession = createAsyncThunk('auth/fetchSession', async (_, { rejectWithValue }) => {
  try {
    const res = await getSessionApi();
    return res?.authenticated ? { user: res.user, token: null } : { user: null, token: null };
  } catch (err) {
    return rejectWithValue(err?.message || 'Failed to fetch session');
  }
});

// PUBLIC_INTERFACE
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue, dispatch }) => {
  try {
    await logoutApi();
    dispatch(showToast({ type: 'success', message: 'Logged out' }));
    return true;
  } catch (err) {
    const msg = err?.message || 'Logout failed';
    dispatch(showToast({ type: 'error', message: msg }));
    return rejectWithValue(msg);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: { login: false, logout: false, session: false },
    error: { login: null, logout: null, session: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading.login = true;
        state.error.login = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading.login = false;
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.isAuthenticated = !!(action.payload?.user || action.payload?.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading.login = false;
        state.error.login = action.payload || 'Login failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // fetch session
      .addCase(fetchSession.pending, (state) => {
        state.loading.session = true;
        state.error.session = null;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.loading.session = false;
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.isAuthenticated = !!(action.payload?.user || action.payload?.token);
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.loading.session = false;
        state.error.session = action.payload || 'Failed to fetch session';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // logout
      .addCase(logout.pending, (state) => {
        state.loading.logout = true;
        state.error.logout = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading.logout = false;
        state.error.logout = action.payload || 'Logout failed';
      });
  },
});

export default authSlice.reducer;
