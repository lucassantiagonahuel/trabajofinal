import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: function() {
        return Math.random().toString(36).substring(2, 15);
      },
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);
