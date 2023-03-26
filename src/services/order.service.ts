import { db, Status, TicketsOnOrders } from "../database";
import { Order, OrderCreatI } from "../interfaces";

class OrderService {
  constructor() {}

  async all(): Promise<Order[]> {
    return await db.order.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async find(id: string): Promise<Order> {
    return await db.order.findUnique({
      where: {
        id,
      },
    });
  }

  async create2(
    newOrderObj: OrderCreatI,
    tickets: TicketsOnOrders[]
  ): Promise<Order> {
    return await db.order.create({
      data: {
        userId: newOrderObj.userId,
        totalPrice: newOrderObj.totalPrice,
        description: newOrderObj.description,
        Tickets: {
          createMany: {
            data: tickets,
          },
        },
      },
    });
  }

  async update(id: string, orderObject: Order): Promise<Order> {
    return await db.order.update({
      where: {
        id,
      },
      data: orderObject,
    });
  }

  async changeStatus(id: string, status: Status): Promise<Order> {
    return await db.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  async create(
    newOrderObj: OrderCreatI,
    tickets: TicketsOnOrders[]
  ): Promise<Order> {
    return await db.$transaction(async (db): Promise<Order> => {
      // 1. Decrement stock from each ticket.
      for (const ticket of tickets) {
        const updatedtTicket = await db.ticket.update({
          data: {
            stock: {
              decrement: ticket.count,
            },
          },
          where: {
            id: ticket.ticketId,
          },
        });

        // 2. Verify that each ticket has engough stock to reserve by Client.
        if (updatedtTicket.stock < 0) {
          throw new Error(
            `Ticket with id:<${ticket.ticketId}> doesn't have enough stock to sell ${ticket.count} units`
          );
        }

        newOrderObj.totalPrice += ticket.count * updatedtTicket.unitPrice;
      }
      console.log(newOrderObj);

      // 3. Create a Order
      const order: Order = await db.order.create({
        data: {
          userId: newOrderObj.userId,
          totalPrice: newOrderObj.totalPrice,
          description: newOrderObj.description,
          Tickets: {
            createMany: {
              data: tickets,
            },
          },
        },
      });

      return order;
    });
  }
}

export default OrderService;
