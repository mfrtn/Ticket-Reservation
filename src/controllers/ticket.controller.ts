import { Response, NextFunction } from "express";
import { TicketService } from "../services";
import { AuthI, ErrorI } from "../interfaces";
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
        const ticket = await this.ticketService.find(id);
        if (ticket) {
          return res.json(ticket).end();
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

  async update(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const inputFileds: Ticket = req.body;

    if (inputFileds.arrivalDate) {
      inputFileds.arrivalDate = new Date(inputFileds.arrivalDate);
    }
    if (inputFileds.departureDate) {
      inputFileds.departureDate = new Date(inputFileds.departureDate);
    }

    try {
      const ticket = await this.ticketService.update(id, inputFileds);
      return res.json(ticket);
    } catch (error) {
      error.code = 400;
      next(error);
    }
  }

  async destroy(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const id: string = req.params.id;

    try {
      const ticket = await this.ticketService.destroy(id);
      res.sendStatus(204);
    } catch (error) {
      error.code = 404;
      error.message = "Ticket Not Found";
      next(error);
    }
  }
}

export default TicketController;
