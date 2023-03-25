import { Response, NextFunction } from "express";
import { TicketService } from "../services";
import { AuthI, ErrorI, UserI } from "../interfaces";
import { Ticket } from "@prisma/client";

class TicketController {
  private ticketService: TicketService;
  constructor(ticketService: TicketService) {
    this.ticketService = ticketService;
  }

  async index(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      if (id === undefined) {
        const tickets = await this.ticketService.all();
        return res.json(tickets).end();
      } else {
        const user = await this.ticketService.find(id);
        if (user) {
          return res.json(user).end();
        }
      }
      const error: ErrorI = new Error();
      error.message = "Not Found";
      error.code = 404;
      next(error);
    } catch (error) {
      error.code = 500;
      next(error);
    }
  }

  async create(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const validTicket: Ticket = req.body;
    try {
      validTicket.arrivalDate = new Date(validTicket.arrivalDate);
      validTicket.departureDate = new Date(validTicket.departureDate);

      const newTicket = await this.ticketService.create(validTicket);

      return res.json(newTicket);
    } catch (error) {
      error.code = 500;
      next(error);
    }
  }
}

export default TicketController;
