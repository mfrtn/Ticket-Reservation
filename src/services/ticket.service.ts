import { db, Ticket } from "../database";
import {} from "../interfaces";

class TicketService {
  constructor() {}

  updatedPermittedData(ticketObject: Ticket) {
    const result = {};

    const permittedKeyChange = [
      "fromLocation",
      "toLocation",
      "arrivalDate",
      "departureDate",
      "unitPrice",
      "stock",
    ];

    for (const key of permittedKeyChange) {
      if (ticketObject.hasOwnProperty(key)) {
        result[key] = ticketObject[key];
      }
    }
    return result;
  }

  async all(): Promise<Ticket[]> {
    return await db.ticket.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async find(id: string): Promise<Ticket> {
    return await db.ticket.findUnique({
      where: {
        id,
      },
    });
  }

  async create(newTicketObj: Ticket): Promise<Ticket> {
    return await db.ticket.create({
      data: newTicketObj,
    });
  }

  async update(id: string, ticketObject: Ticket): Promise<Ticket> {
    return await db.ticket.update({
      where: {
        id,
      },
      data: this.updatedPermittedData(ticketObject),
    });
  }

  async destroy(id: string): Promise<Ticket> {
    return await db.ticket.delete({
      where: {
        id,
      },
    });
  }
}

export default TicketService;
