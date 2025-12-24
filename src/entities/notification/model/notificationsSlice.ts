import type { PayloadAction } from '@reduxjs/toolkit'
import type { Notification, NotificationsState } from './types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import DeltaStorage from '@shared/lib/storage'
import fetchNotifications from '../api/notificationsApi'

export const initializeNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>('notifications/initialize', async (_, { rejectWithValue }) => {
  try {
    const notifications = await DeltaStorage.getAllNotifications()
    return notifications
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to initialize notifications',
    )
  }
})

const initialState: NotificationsState = {
  items: [],
  loading: false,
  error: null,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.push(action.payload)
    },
    updateNotification(
      state,
      action: PayloadAction<{ id: number, changes: Partial<Notification> }>,
    ) {
      const { id, changes } = action.payload
      const notification = state.items.find((item) => item.id === id)
      if (notification) {
        Object.assign(notification, changes)
      }
    },
    deleteNotification(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    markAsRead(state, action: PayloadAction<number>) {
      const notification = state.items.find((item) => item.id === action.payload)
      if (notification) {
        notification.readed = true
      }
    },
    markAllAsReadForUser(state, action: PayloadAction<number>) {
      state.items.forEach((item) => {
        if (item.userId === action.payload) {
          item.readed = true
        }
      })
    },
    clearViewedForUser(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.userId !== action.payload || !item.readed)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to fetch notifications'
      })
      .addCase(initializeNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(initializeNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(initializeNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to initialize notifications'
      })
  },
})

export const {
  addNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsReadForUser,
  clearViewedForUser,
} = notificationsSlice.actions

export default notificationsSlice.reducer
