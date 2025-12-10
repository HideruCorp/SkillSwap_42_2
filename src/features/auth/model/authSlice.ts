import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Nullable } from '@shared/types';
import authApi from '../api/authApi';
import type { AuthTokens, AuthState, LoginCredentials } from './types';

// ============ HELPERS ============

function getStoredTokens(): Nullable<AuthTokens> {
  try {
    const data = localStorage.getItem('auth_tokens');
    if (!data) return null;

    const tokens: AuthTokens = JSON.parse(data);
    if (tokens.expiresAt < Date.now()) {
      localStorage.removeItem('auth_tokens');
      return null;
    }
    return tokens;
  } catch {
    return null;
  }
}

function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
}

function clearTokens(): void {
  localStorage.removeItem('auth_tokens');
}

// ============ INITIAL STATE ============

const initialState: AuthState = {
  tokens: getStoredTokens(),
  isLoggingIn: false,
  isRegistering: false,
  loginError: null,
  registerError: null,
};

// ============ ASYNC THUNKS ============

export const login = createAsyncThunk<
  { tokens: AuthTokens; userId: number },
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);
    saveTokens(response.tokens);
    localStorage.setItem('currentUserId', String(response.user.id));
    return { tokens: response.tokens, userId: response.user.id };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Ошибка входа');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
  clearTokens();
  localStorage.removeItem('currentUserId');
});

// ============ SLICE ============

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<AuthTokens>) {
      state.tokens = action.payload;
      saveTokens(action.payload);
    },
    clearAuthError(state) {
      state.loginError = null;
      state.registerError = null;
    },
    setLoginError(state, action: PayloadAction<string>) {
      state.loginError = action.payload;
    },
    setRegisterError(state, action: PayloadAction<string>) {
      state.registerError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.tokens = action.payload.tokens;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.loginError = action.payload ?? 'Ошибка входа';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.tokens = null;
      });
  },
  selectors: {
    selectTokens: (state) => state.tokens,
    selectIsLoggedIn: (state) => state.tokens !== null,
    selectIsLoggingIn: (state) => state.isLoggingIn,
    selectLoginError: (state) => state.loginError,
    selectIsRegistering: (state) => state.isRegistering,
    selectRegisterError: (state) => state.registerError,
  },
});

export const { setTokens, clearAuthError, setLoginError, setRegisterError } = authSlice.actions;
export const {
  selectTokens,
  selectIsLoggedIn,
  selectIsLoggingIn,
  selectLoginError,
  selectIsRegistering,
  selectRegisterError,
} = authSlice.selectors;

export default authSlice.reducer;
