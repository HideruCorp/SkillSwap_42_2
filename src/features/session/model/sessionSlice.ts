import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@entities/user';
import type { Nullable } from '@shared/types';
import { loadUserById } from '@shared/lib/storage';

// ============ TYPES ============

export interface SessionState {
  user: Nullable<User>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Nullable<string>;
}

// ============ INITIAL STATE ============

const initialState: SessionState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // true при старте для проверки сессии
  error: null,
};

// ============ ASYNC THUNKS ============

/**
 * Инициализация сессии при старте приложения
 */
export const initSession = createAsyncThunk<Nullable<User>, void, { rejectValue: string }>(
  'session/init',
  async (_, { rejectWithValue }) => {
    try {
      const savedUserId = localStorage.getItem('currentUserId');
      if (!savedUserId) {
        return null;
      }

      const user = await loadUserById(Number(savedUserId));
      if (!user) {
        localStorage.removeItem('currentUserId');
        return null;
      }

      return user;
    } catch (error) {
      localStorage.removeItem('currentUserId');
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка инициализации сессии'
      );
    }
  }
);

/**
 * Загрузка пользователя по ID
 */
export const fetchCurrentUser = createAsyncThunk<User, number, { rejectValue: string }>(
  'session/fetchCurrentUser',
  async (userId, { rejectWithValue }) => {
    try {
      const user = await loadUserById(userId);
      if (!user) {
        return rejectWithValue('Пользователь не найден');
      }
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки пользователя'
      );
    }
  }
);

// ============ SLICE ============

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('currentUserId', String(action.payload.id));
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearSession(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('auth_tokens');
    },
    setSessionError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Init session
      .addCase(initSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initSession.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(initSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка';
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('currentUserId', String(action.payload.id));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка';
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsSessionLoading: (state) => state.isLoading,
    selectSessionError: (state) => state.error,
  },
});

export const { setUser, updateUser, clearSession, setSessionError } = sessionSlice.actions;
export const { selectUser, selectIsAuthenticated, selectIsSessionLoading, selectSessionError } =
  sessionSlice.selectors;

export default sessionSlice.reducer;
