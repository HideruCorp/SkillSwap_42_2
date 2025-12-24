import type { Notification } from '../model/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import memoizeRequest from '@shared/lib/api/memoizeRequest'

const fetchNotificationsRequest = memoizeRequest(async () => {
  const response = await fetch('/db/notifications.json')
  if (!response.ok) {
    throw new Error('Failed to fetch notifications')
  }
  const data: Notification[] = await response.json()
  return data
})

const fetchNotifications = createAsyncThunk<Notification[], void, { rejectValue: string }>(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchNotificationsRequest()
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error')
    }
  },
)

export default fetchNotifications
