import { userModel } from "../models/user.js";

export class UserClass {
  getUserByEmail = async (email) => {
    const user = await userModel.findOne({ email: email });
    return user;
  };

  getUsers = async () => {
    const users = await userModel.find();
    return users;
  };

  updateUserPassword = async (user) => {
    const response = await userModel.findOneAndUpdate(
      { email: user.email },
      user
    );
    return response;
  };

  getUserById = async (id) => {
    const user = await userModel.findById(id);
    return user;
  };

  updateUserRole = async (user) => {
    const response = await userModel.updateOne({ _id: user._id }, user);
    return response;
  };

  userDocuments = async (user) => {
    const response = await userModel.findOneAndUpdate(
      { email: user.email },
      user
    );
    return response;
  };

  getUserInactives = async (timerOut) => {
    const usersInactives = await userModel.find({
      last_connection: { $lt: timerOut },
    });
    return usersInactives;
  };

  deleteUsersInactive = async (timerOut) => {
    const response = await userModel.deleteMany({
      last_connection: { $lt: timerOut },
    });
    return response;
  };
}
