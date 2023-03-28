import { Response, NextFunction } from "express";
import { createClient } from "redis";
import { parse } from "node-html-parser";
import * as fs from "fs";

import { TicketService } from "../services";
import {
  AuthI,
  ErrorI,
  TicketQueryI,
  Ticket,
  TicketFilterI,
} from "../interfaces";
import config from "../config";
import { capitalize } from "../utilities";

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
          result[key] = new Date(queryObject[key]).toString();
          continue;
        }
        result[key] = queryObject[key];
      } else {
        result[key] = "";
      }
    }

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
    try {
      const ticket = await this.ticketService.find(id);

      if (!ticket) {
        const error: ErrorI = new Error();
        error.message = "Invalid Ticket";
        error.code = 400;
        return next(error);
      }

      if (inputFileds.arrivalDate) {
        inputFileds.arrivalDate = new Date(inputFileds.arrivalDate);
      }
      if (inputFileds.departureDate) {
        inputFileds.departureDate = new Date(inputFileds.departureDate);
      }

      const updatedTicket = await this.ticketService.update(id, inputFileds);
      return res.json(updatedTicket);
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
      const newFilterObject: TicketFilterI = {};

      if (Object.keys(filterObject).length === 0) {
        const error: ErrorI = new Error();
        error.message = "Query Not Found";
        error.code = 404;
        return next(error);
      }

      newFilterObject["fromLocation"] = filterObject.from;
      newFilterObject["toLocation"] = filterObject.to;

      if (!Date.parse(filterObject.departure)) {
        delete filterObject.departure;
      } else {
        newFilterObject["departureDate"] = new Date(filterObject.departure);
      }

      if (!Date.parse(filterObject.arrival)) {
        delete filterObject.arrival;
      } else {
        newFilterObject["arrivalDate"] = new Date(filterObject.arrival);
      }

      const tickets = await this.ticketService.filter(newFilterObject);

      return res.json({
        tickets,
      });
    } catch (error) {
      next(error);
    }
  }

  async print(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const ticketId: string = req.params.id;
    const userId = req.user.id;
    try {
      const ticket = await this.ticketService.find(ticketId);
      if (!ticket) {
        const error: ErrorI = new Error();
        error.message = "Not Found";
        error.code = 404;
        return next(error);
      }
      // Check if this ticket exists in the user's paid orders or not
      if (!(await this.ticketService.checkUserBoughtTicket(userId, ticketId))) {
        const error: ErrorI = new Error();
        error.message = "Not Authorized";
        error.code = 401;
        return next(error);
      }

      const htmlPath: string = global.__viewdir + "ticket.html";

      fs.readFile(htmlPath, (err, html: any) => {
        if (err) {
          return next(err);
        } else {
          const document = parse(html);

          document.getElementById("clientName").innerHTML =
            req.user.fname + " " + req.user.lname;

          document.getElementById("cName").innerHTML =
            req.user.fname.slice(0, 3) + "," + req.user.lname;

          document.getElementById("fromLocation").innerHTML = capitalize(
            ticket.fromLocation
          );
          document.getElementById("toLocation").innerHTML = capitalize(
            ticket.toLocation
          );
          document.getElementById("time").innerHTML = ticket.departureDate
            .toString()
            .slice(0, -33);
          document.getElementById("atime").innerHTML = ticket.arrivalDate
            .toString()
            .slice(0, -33);
          document.getElementById("code").innerHTML = ticket.id;

          return res.end(document.toString());
        }
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default TicketController;
