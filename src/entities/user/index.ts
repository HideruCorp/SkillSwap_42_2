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

/* TODO move UI components from shared/widget layers
// Карточка в каталоге
export { UserCard } from './ui/user-card';
// Карточка пользователя на странице скилла
export { UserDetails } from './ui/user-details';
*/
