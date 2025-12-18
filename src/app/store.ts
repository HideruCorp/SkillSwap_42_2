import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';

import notificationsReducer from '@entities/notification';
import usersReducer from '@entities/user';
import skillsReducer from '@entities/skill';
import requestsReducer from '@entities/request';
import exchangesReducer from '@entities/exchange';
import userLikesReducer from '@/entities/user/model/userLikesSlice';

import { authReducer, registrationReducer, authListener } from '@features/auth';
import filtersReducer from '@features/filters';
import sortReducer from '@features/sort';

import persistMiddleware from '@shared/lib/storage/persistMiddleware';

export const rootReducer = combineReducers({
  users: usersReducer,
  skills: skillsReducer,
  userLikes: userLikesReducer,
  notifications: notificationsReducer,
  requests: requestsReducer,
  exchanges: exchangesReducer,
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