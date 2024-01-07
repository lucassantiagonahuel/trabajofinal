import { MessageClass } from "../dao/class/messageClass.js";

const messageClass = new MessageClass();


const getMessage = async (req,res) =>{
    try {
        const response = await messageClass.getMessages();
        res.send(response);
      } catch (error) {
        res.status(500).send(error.message);
      }
}

const sendMessages = async (req,res) => {
    try {
        const response = await messageClass.addMessage();
        res.send(response);
        
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export default {
    getMessage,
    sendMessages
}