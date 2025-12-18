import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserId } from '@shared/types';

interface UserLikesState {
  likes: Record<UserId, UserId[]>;
}

const initialState: UserLikesState = {
  likes: JSON.parse(localStorage.getItem('userLikes') || '{}'),
};

const userLikesSlice = createSlice({
  name: 'userLikes',
  initialState,
  reducers: {
    toggleUserLike(state, action: PayloadAction<{ userId: UserId; targetUserId: UserId }>) {
      const { userId, targetUserId } = action.payload;

      if (!state.likes[userId]) {
        state.likes[userId] = [];
      }

      const userLikes = state.likes[userId];
      const isLiked = userLikes.includes(targetUserId);

      if (isLiked) {
        state.likes[userId] = userLikes.filter(id => id !== targetUserId);
      } else {
        state.likes[userId] = [...userLikes, targetUserId];
      }

      localStorage.setItem('userLikes', JSON.stringify(state.likes));
    },
  },
});

export const { toggleUserLike } = userLikesSlice.actions;
export default userLikesSlice.reducer;