import type { TypedUseSelectorHook } from 'react-redux'
import exchangesReducer from '@entities/exchange'

import favoritesReducer from '@entities/favorites'
import notificationsReducer from '@entities/notification'
import requestsReducer from '@entities/request'
import skillsReducer from '@entities/skill'
import usersReducer from '@entities/user'
import { authListener, authReducer, registrationReducer } from '@features/auth'

import filtersReducer from '@features/filters'
import sortReducer from '@features/sort'
import { themeReducer } from '@features/theme'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

import persistMiddleware from '@shared/lib/storage/persistMiddleware'
import {
  useDispatch as dispatchHook,
  useSelector as selectorHook,

} from 'react-redux'

export const rootReducer = combineReducers({
  users: usersReducer,
  skills: skillsReducer,
  notifications: notificationsReducer,
  requests: requestsReducer,
  exchanges: exchangesReducer,
  favorites: favoritesReducer,
  auth: authReducer,
  theme: themeReducer,
  registration: registrationReducer,
  filters: filtersReducer,
  sort: sortReducer,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authListener.middleware).concat(persistMiddleware),
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const useDispatch: () => AppDispatch = () => dispatchHook()
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook

export default store
