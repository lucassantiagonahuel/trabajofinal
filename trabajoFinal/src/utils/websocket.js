import { Server } from "socket.io";
import { MessageClass } from "../dao/class/messageClass.js";

const mesaggeClass = new MessageClass();

export function configureWebSocket(httpServer) {
    const io = new Server(httpServer);
  
    io.on("connection", (socket) => {
      console.log("New client connected");
  
      socket.on("sendData", (data) => {
        io.emit("updateList", data);
      });
  
      socket.on("message", async (data) => {
        await mesaggeClass.addMessage(data);
        let messages = await mesaggeClass.getMessages();
        io.emit("messagesLoad", messages);
      });
    });
  }