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
      localStorage.removeItem('currentUserId');
      return null;
    }
    return tokens;
  } catch {
    return null;
  }
}

function getStoredUserId(): number | null {
  try {
    const rawId = localStorage.getItem('currentUserId');
    return rawId ? Number(rawId) : null;
  } catch {
    return null;
  }
}

function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
}

function clearTokens(): void {
  localStorage.removeItem('auth_tokens');
  localStorage.removeItem('currentUserId');
}

// ============ INITIAL STATE ============

const initialState: AuthState = {
  tokens: getStoredTokens(),
  currentUserId: getStoredUserId(),
  checked: false,
  isLoggingIn: false,
  isRegistering: false,
  loginError: null,
  registerError: null,
};

// ============ ASYNC THUNKS ============

/**
 * Bootstrap auth при старте приложения
 * Проверяет валидность сохранённых токенов и userId
 */
export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const tokens = getStoredTokens();
  const rawId = localStorage.getItem('currentUserId');
  const currentUserId = rawId ? Number(rawId) : null;

  if (!tokens || tokens.expiresAt < Date.now() || !currentUserId) {
    clearTokens();
    return { tokens: null, currentUserId: null };
  }

  return { tokens, currentUserId };
});

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
    setCurrentUserId(state, action: PayloadAction<number>) {
      state.currentUserId = action.payload;
      localStorage.setItem('currentUserId', String(action.payload));
    },
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.checked = action.payload;
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
      // Bootstrap
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.tokens = action.payload.tokens;
        state.currentUserId = action.payload.currentUserId;
        state.checked = true;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.tokens = action.payload.tokens;
        state.currentUserId = action.payload.userId;
        state.checked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.loginError = action.payload ?? 'Ошибка входа';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.tokens = null;
        state.currentUserId = null;
        // checked остаётся true — мы знаем, что пользователь вышел
      });
  },
  selectors: {
    selectTokens: (state) => state.tokens,
    selectCurrentUserId: (state) => state.currentUserId,
    selectAuthChecked: (state) => state.checked,
    selectIsLoggedIn: (state) => state.tokens !== null && state.currentUserId !== null,
    selectIsLoggingIn: (state) => state.isLoggingIn,
    selectLoginError: (state) => state.loginError,
    selectIsRegistering: (state) => state.isRegistering,
    selectRegisterError: (state) => state.registerError,
  },
});

export const {
  setTokens,
  setCurrentUserId,
  setAuthChecked,
  clearAuthError,
  setLoginError,
  setRegisterError,
} = authSlice.actions;

export const {
  selectTokens,
  selectCurrentUserId,
  selectAuthChecked,
  selectIsLoggedIn,
  selectIsLoggingIn,
  selectLoginError,
  selectIsRegistering,
  selectRegisterError,
} = authSlice.selectors;

export default authSlice.reducer;
