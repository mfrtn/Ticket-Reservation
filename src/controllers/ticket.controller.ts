import { Response, NextFunction } from "express";
import { createClient } from "redis";

import { TicketService } from "../services";
import { AuthI, ErrorI, TicketQueryI, Ticket } from "../interfaces";
import config from "../config";

class TicketController {
  private redisFiletKeyTimeOut: number;
  private ticketService: TicketService;

  constructor(ticketService: TicketService) {
    this.ticketService = ticketService;
    this.redisFiletKeyTimeOut = config.QUERY_EXPIRE_TIME;
  }

  private queryPermittedData(queryObject: TicketQueryI) {
    const result = {};

    const permittedKeyChange = ["from", "to", "arrival", "departure"];

    for (const key of permittedKeyChange) {
      if (queryObject.hasOwnProperty(key)) {
        if (key === "arrival" || key === "departure") {
          result[key] = new Date(queryObject[key]).toDateString();
          continue;
        }
        result[key] = queryObject[key];
      } else {
        result[key] = "";
      }
    }
    console.log(result);

    return result;
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

  async destroyMany(
    req: AuthI.AuthRequestI,
    res: Response,
    next: NextFunction
  ) {
    const result = {};
    const { ids }: { ids: string[] } = req.body;

    try {
      for (const id of ids) {
        try {
          const deletedTicket = await this.ticketService.destroy(id);
          if (deletedTicket) {
            result[id] = 1;
          }
        } catch (error) {
          result[id] = 0;
        }
      }
      return res.json(result);
    } catch (error) {
      error.code = 400;
      error.message = "Invalid Request!";
      next(error);
    }
  }

  async createQuery(
    req: AuthI.AuthRequestI,
    res: Response,
    next: NextFunction
  ) {
    const query: TicketQueryI = this.queryPermittedData(req.query);

    try {
      const client = createClient();
      await client.connect();

      if (!(await client.get("queryId"))) {
        await client.set("queryId", 0);
      }
      const queryIdString = (await client.incr("queryId")).toString();

      await client.hSet(queryIdString, [
        ["from", query.from],
        ["to", query.to],
        ["arrival", query.arrival],
        ["departure", query.departure],
      ]);

      await client.expire(queryIdString, this.redisFiletKeyTimeOut);
      await client.disconnect();

      return res.json({
        queryId: queryIdString,
        query,
      });
    } catch (error) {
      next(error);
    }
  }

  async runQuery(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const queryId: string = req.params.id;

    try {
      const client = createClient();
      await client.connect();
      const filterObject: TicketQueryI = await client.hGetAll(queryId);
      await client.disconnect();

      if (Object.keys(filterObject).length === 0) {
        const error: ErrorI = new Error();
        error.message = "Query Not Found";
        error.code = 404;
        return next(error);
      }
      if (!Date.parse(filterObject.departure)) {
        delete filterObject.departure;
      }

      if (!Date.parse(filterObject.arrival)) {
        delete filterObject.arrival;
      }

      const tickets = await this.ticketService.filter(filterObject);

      return res.json({
        tickets,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default TicketController;
