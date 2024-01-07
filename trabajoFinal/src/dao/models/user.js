import mongoose from "mongoose";
import { cartCollection } from "./cart.js";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    require: true,
    unique: true,
  },
  age: Number,
  password: {
    type: String,
    require: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cartCollection,
  },
  role: {
    type: String,
  },
  documents: {
    type: [
      {
        name: { type: String, required: true },
        reference: { type: String, required: true },
      },
    ],
    default: [],
  },
  last_connection: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enums: ["completo", "incompleto", "pendiente"],
    default: "pendiente",
  },
  avatar: { type: String, default: "" },
});

export const userModel = mongoose.model(userCollection, userSchema);
