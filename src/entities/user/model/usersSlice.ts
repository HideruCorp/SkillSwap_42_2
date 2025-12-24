import type { PayloadAction } from '@reduxjs/toolkit'
import type { Nullable, User } from '@shared/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loadMergedData } from '@shared/lib/storage'

interface UsersState {
  items: User[]
  isLoading: boolean
  error: Nullable<string>
}

const initialState: UsersState = {
  items: [],
  isLoading: false,
  error: null,
}

export const initializeUsers = createAsyncThunk('users/initialize', async () => {
  const { users } = await loadMergedData()
  return users
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.items = action.payload
    },

    /**
     * Добавление пользователя в Redux.
     * passwordHash передаём через action.meta (для persistMiddleware)
     */
    addUser: {
      reducer(state, action: PayloadAction<User>) {
        state.items.push(action.payload)
      },
      prepare(user: User, passwordHash?: string) {
        return {
          payload: user,
          meta: passwordHash ? { passwordHash } : {},
        }
      },
    },

    updateUser(state, action: PayloadAction<{ id: number, changes: Partial<User> }>) {
      const index = state.items.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.changes }
      }
    },
    deleteUser(state, action: PayloadAction<number>) {
      state.items = state.items.filter((u) => u.id !== action.payload)
    },
    setUsersLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setUsersError(state, action: PayloadAction<Nullable<string>>) {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(initializeUsers.fulfilled, (state, action) => {
        state.items = action.payload
        state.isLoading = false
      })
      .addCase(initializeUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to load users'
      })
  },
  selectors: {
    selectAllUsers: (state) => state.items,
    selectUserById: (state, id: number) => state.items.find((u) => u.id === id),
    selectUsersLoading: (state) => state.isLoading,
    selectUsersError: (state) => state.error,
  },
})

export const { setUsers, addUser, updateUser, deleteUser, setUsersLoading, setUsersError }
  = usersSlice.actions

export const { selectAllUsers, selectUserById, selectUsersLoading, selectUsersError }
  = usersSlice.selectors

export default usersSlice.reducer
