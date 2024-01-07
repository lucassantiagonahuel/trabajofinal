import { userModel } from "../models/user.js";

export class SessionClass {
  updateConnection = async (user) => {
    const response = await userModel.findOneAndUpdate(
      { email: user.email },
      user
    );
    return response;
  };
}
