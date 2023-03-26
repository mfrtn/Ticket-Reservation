import { db, Status, TicketsOnOrders } from "../database";
import { Order, OrderCreatI } from "../interfaces";
import { WalletService } from "../services";

class OrderService {
  private walletService: WalletService;

  constructor(walletService: WalletService) {
    this.walletService = walletService;
  }
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

        // 3. Callculate order totalPrice from each Ticket
        newOrderObj.totalPrice += ticket.count * updatedtTicket.unitPrice;
      }

      // 4. Create an Order
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

  async cancelOrder(order: Order): Promise<Order> {
    return await db.$transaction(async (db): Promise<Order> => {
      //Get All Tickets of Order
      const orderWithTickets = await db.order.findUniqueOrThrow({
        where: {
          id: order.id,
        },
        include: {
          Tickets: {
            select: {
              count: true,
              Ticket: {
                select: { id: true, departureDate: true },
              },
            },
          },
        },
      });

      const currentTime = new Date();

      // Check that there is at least 30 minutes left on all tickets of this order
      // Increase each Ticket stock
      for (const ticket of orderWithTickets.Tickets) {
        const updatedtTicket = await db.ticket.update({
          data: {
            stock: {
              increment: ticket.count,
            },
          },
          where: {
            id: ticket.Ticket.id,
          },
        });

        // leftTime in Minutes
        const leftTime: number =
          (updatedtTicket.departureDate.getTime() - currentTime.getTime()) /
          6000;

        if (leftTime < 30) {
          throw new Error(
            `Ticket with id:<${updatedtTicket.id}> has les than 30 minutes to Departure Time`
          );
        }
      }

      // Update User wallet if Order Status is PAID
      if (order.status === Status.PAID) {
        const newTransaction = await this.walletService.deposit(
          order.userId,
          order.totalPrice,
          null,
          order.id
        );
      }

      const updatedOrder = db.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: Status.CANCELLED,
        },
      });
      return updatedOrder;
    });
  }
}

export default OrderService;
