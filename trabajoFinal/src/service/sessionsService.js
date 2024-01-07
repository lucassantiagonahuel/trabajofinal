import { SessionClass } from "../dao/class/sessionsClass.js";

const sessionClass = new SessionClass();

const updateConnection = async (user) => {
    user.last_connection = new Date();
  const response = await sessionClass.updateConnection(user);
  return response;
};

export default {
  updateConnection,
};
