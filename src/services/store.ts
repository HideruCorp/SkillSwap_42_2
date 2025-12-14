import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';

// Entity reducers
import notificationsReducer from '@entities/notification';
import usersReducer from '@entities/user';
import skillsReducer from '@entities/skill';
import requestsReducer from '@entities/request';
import exchangesReducer from '@entities/exchange';

// Feature reducers
import { authReducer, registrationReducer, authListener } from '@features/auth';

// Middleware
import persistMiddleware from '@shared/lib/storage/persistMiddleware';

// TODO: переместить в  @features
import filtersReducer from './slices/filtersSlice/filtersSlice';
import sortReducer from './slices/sortSlice/sortSlice';

export const rootReducer = combineReducers({
  // Entities
  users: usersReducer,
  skills: skillsReducer,
  notifications: notificationsReducer,
  requests: requestsReducer,
  exchanges: exchangesReducer,

  // Features
  auth: authReducer,
  registration: registrationReducer,
  filters: filtersReducer,
  sort: sortReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authListener.middleware).concat(persistMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
