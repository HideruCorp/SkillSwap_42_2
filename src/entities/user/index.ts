import usersReducer from './model/usersSlice'

// Types
export type { CreateUserDTO, UpdateUserDTO, User, UserPreview } from './model/types'

// Slice
export {
  addUser,
  deleteUser,
  selectAllUsers,
  selectUserById,
  selectUsersError,
  selectUsersLoading,
  setUsers,
  updateUser,
  default as usersReducer,
} from './model/usersSlice'

export default usersReducer
