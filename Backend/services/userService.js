import { getAllUsers } from "../models/userModel.js"

export const fetchUsers = async () => {
  return await getAllUsers()
}
