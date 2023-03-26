import { Response, NextFunction } from "express";
import * as schedule from "node-schedule";

import { OrderService, WalletService } from "../services";
import config from "../config";
import {
  AuthI,
  ErrorI,
  Order,
  TicketsOnOrders,
  OrderCreatI,
  Status,
  UserI,
} from "../interfaces";

class OrderController {
  private cancelPeriod: number;
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
    this.cancelPeriod = config.ORDER_CANCEL_PERIOD;
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

      // Create a Cron Job for cancelling an Order if not pay after a specific period.
      const t = new Date();
      t.setSeconds(t.getSeconds() + this.cancelPeriod);
      const cancelJob = schedule.scheduleJob(t, async () => {
        const order = await this.orderService.find(newOrder.id);
        if (order) {
          if (order.status === Status.RESERVED) {
            await this.orderService.cancelOrder(order);
          }
        }
      });

      return res.json(newOrder);
    } catch (error) {
      error.code = 400;
      next(error);
    }
  }

  async update(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {}

  async cancel(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      const order = await this.orderService.find(id);

      // Check User Authorization
      if (
        req.user.role !== UserI.Role.ADMIN &&
        req.user.role !== UserI.Role.OPERATOR
      ) {
        if (req.user.id !== order.userId) {
          const error: ErrorI = new Error();
          error.message = "You are not authorized";
          error.code = 401;
          return next(error);
        }
      }
      if (order) {
        //Check Order Status
        if (order.status !== Status.CANCELLED) {
          const updatedOrder = await this.orderService.cancelOrder(order);
          return res.json(updatedOrder);
        } else {
          const error: ErrorI = new Error();
          error.message = "Order has been cancelled before";
          error.code = 400;
          return next(error);
        }
      }
      const error: ErrorI = new Error();
      error.message = "Order Not Found";
      error.code = 404;
      return next(error);
    } catch (error) {
      error.code = 500;
      return next(error);
    }
  }

  async payment(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {}
}

export default OrderController;
