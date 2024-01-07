import { TicketClass } from "../dao/class/ticketClass.js";

const ticketClass = new TicketClass();

const createNewTicket = async (email, price) => {
  const newTicket = {
    amount: price,
    purchaser: email,
  };
  const response = await ticketClass.newTicket(newTicket);
  return response;
};

export default {
  createNewTicket,
};
