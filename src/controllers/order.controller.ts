import { Response, NextFunction } from "express";

import { OrderService } from "../services";
import {
  AuthI,
  ErrorI,
  Order,
  TicketsOnOrders,
  OrderCreatI,
  Status,
} from "../interfaces";

class OrderController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  async index(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      if (id === undefined) {
        const orders = await this.orderService.all();
        return res.json(orders).end();
      } else {
        const order = await this.orderService.find(id);
        if (order) {
          return res.json(order).end();
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
    const {
      tickets,
      description,
    }: { tickets: TicketsOnOrders[]; description: string } = req.body;

    const newOrderObj: OrderCreatI = {
      userId: req.user.id,
      totalPrice: 0,
      description,
    };

    try {
      const newOrder = await this.orderService.create(newOrderObj, tickets);
      return res.json(newOrder);
    } catch (error) {
      error.code = 400;
      next(error);
    }
  }

  async update(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {}

  async cancel(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {}

  async payment(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {}
}

export default OrderController;
