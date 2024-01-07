import {messageModel} from "../models/message.js";

export class MessageClass {
  constructor() {}

  getMessages = async () => {
    return messageModel.find();
  };

  addMessage = async (message) => {
    const response = await messageModel.create(message);
    return response;
  };
}
