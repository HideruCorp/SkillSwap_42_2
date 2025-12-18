import usersReducer from './model/usersSlice';

// Types
export type { User, UserPreview, CreateUserDTO, UpdateUserDTO } from './model/types';

// Slice
export {
  default as usersReducer,
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  selectAllUsers,
  selectUserById,
  selectUsersLoading,
  selectUsersError,
} from './model/usersSlice';

export default usersReducer;
