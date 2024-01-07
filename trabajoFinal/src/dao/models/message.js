import mongoose from "mongoose";


const messageCollection = "messages";

const messageSchema = new mongoose.Schema({
    user : {
        type : String,
        required : true
    },
    message : String
});

export const messageModel = mongoose.model(messageCollection, messageSchema);