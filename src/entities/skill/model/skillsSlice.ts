import { loadMergedData } from '@shared/lib/storage';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Skill, Nullable, UserId } from '@shared/types';

interface SkillsState {
  items: Skill[];
  isLoading: boolean;
  error: Nullable<string>;
}

const initialState: SkillsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const initializeSkills = createAsyncThunk('skills/initialize', async () => {
  const { skills } = await loadMergedData();
  return skills;
});

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSkills(state, action: PayloadAction<Skill[]>) {
      state.items = action.payload;
    },
    addSkill(state, action: PayloadAction<Skill>) {
      state.items.push(action.payload);
    },
    updateSkill(state, action: PayloadAction<{ id: number; changes: Partial<Skill> }>) {
      const index = state.items.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.changes };
      }
    },
    deleteSkill(state, action: PayloadAction<number>) {
      state.items = state.items.filter((s) => s.id !== action.payload);
    },
    // Favorites
    addFavorite(state, action: PayloadAction<{ skillId: number; userId: UserId }>) {
      const skill = state.items.find((s) => s.id === action.payload.skillId);
      if (skill && !skill.likesReceived.includes(action.payload.userId)) {
        skill.likesReceived.push(action.payload.userId);
      }
    },
    removeFavorite(state, action: PayloadAction<{ skillId: number; userId: UserId }>) {
      const skill = state.items.find((s) => s.id === action.payload.skillId);
      if (skill) {
        skill.likesReceived = skill.likesReceived.filter((id) => id !== action.payload.userId);
      }
    },
    setSkillsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSkillsError(state, action: PayloadAction<Nullable<string>>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeSkills.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(initializeSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load skills';
      });
  },
  selectors: {
    selectAllSkills: (state) => state.items,
    selectSkillById: (state, id: number) => state.items.find((s) => s.id === id),
    selectSkillsByUserId: (state, userId: number) => state.items.filter((s) => s.userId === userId),
    selectFavoriteSkillIds: (state, userId: number) =>
      state.items.filter((s) => s.likesReceived.includes(userId)).map((s) => s.id),
    selectSkillsLoading: (state) => state.isLoading,
    selectSkillsError: (state) => state.error,
  },
});

export const {
  setSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  addFavorite,
  removeFavorite,
  setSkillsLoading,
  setSkillsError,
} = skillsSlice.actions;

export const {
  selectAllSkills,
  selectSkillById,
  selectSkillsByUserId,
  selectFavoriteSkillIds,
  selectSkillsLoading,
  selectSkillsError,
} = skillsSlice.selectors;

export default skillsSlice.reducer;
