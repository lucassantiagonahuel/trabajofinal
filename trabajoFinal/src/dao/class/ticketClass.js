import { ticketModel } from "../models/ticket.js";

export class TicketClass {
  constructor() {}
  newTicket = async (ticket) => {
    const response = await ticketModel.create(ticket);

    return response;
  };
}
