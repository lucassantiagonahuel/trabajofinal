import { UserClass } from "../dao/class/userClass.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import MailingService from "./mailingService.js";

let userClass = new UserClass();
const emailService = new MailingService();

const getUserByEmail = async (email) => {
  const user = await userClass.getUserByEmail(email);
  return user;
};

const getUsers = async () => {
  const users = await userClass.getUsers();
  return users;
};

const updatePassword = async (user, newPassword) => {
  if (isValidPassword(user, newPassword)) {
    throw new Error("No puedes usar la misma contraseña");
  }

  const passwordUpdate = createHash(newPassword);
  user.password = passwordUpdate;

  const userUpdatePassword = await userClass.updateUserPassword(user);
  return userUpdatePassword;
};

const getUserById = async (id) => {
  const user = await userClass.getUserById(id);
  return user;
};

const updateRole = async (user, role) => {
  if (user.status != "completo" && user.role != "premium") {
    throw new Error("User with incomplete documents");
  }
  if (role === "user") {
    user.role = "premium";
  } else if (role === "premium") {
    user.role = "user";
  } else {
    throw new Error("Error change password.");
  }
  const response = await userClass.updateUserRole(user);
  return response;
};

const userDocuments = async (user) => {
  const response = await userClass.userDocuments(user);
  return response;
};

const deleteUsersInactive = async () => {
  const timerOut = new Date(Date.now() - 10 * 60 * 1000);
  const usersInactives = await userClass.getUserInactives(timerOut);
  const response = await userClass.deleteUsersInactive(timerOut);
  for (const user of usersInactives) {
    await emailService.sendEmailDeletedUser(user.email);
  }
  return response;
};

export default {
  getUserByEmail,
  getUsers,
  updatePassword,
  getUserById,
  updateRole,
  userDocuments,
  deleteUsersInactive,
};
