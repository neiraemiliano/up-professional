import * as usersAPI from "../../api/users";
import { createResourceHooks } from "./baseResourceHooks";
export const {
  useList: useUsers,
  useItem: useUser,
  useCreate: useCreateUser,
  useUpdate: useUpdateUser,
  useDelete: useDeleteUser,
} = createResourceHooks("users", {
  fetchAll: usersAPI.fetchUsers,
  fetchOne: usersAPI.fetchUser,
  create: usersAPI.createUser,
  update: usersAPI.updateUser,
  remove: usersAPI.deleteUser,
});
