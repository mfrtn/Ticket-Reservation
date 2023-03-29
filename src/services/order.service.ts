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

  async update(
    order: Order,
    description: string,
    tickets: TicketsOnOrders[]
  ): Promise<Order> {
    return await db.$transaction(async (db): Promise<Order> => {
      const currentTime = new Date();
      for (const ticket of tickets) {
        /*
         * Get previous ticket count on this order (oldCount)
         */
        const oldTicketOnOrders = await db.ticketsOnOrders.findUnique({
          where: {
            ticketId_orderId: {
              orderId: order.id,
              ticketId: ticket.ticketId,
            },
          },
        });
        /*
         * Check Ticket exists on this order or not
         */
        if (!oldTicketOnOrders) {
          if (ticket.count <= 0) {
            continue;
          }
          /*
           * Ticket does not include in this order we should add the ticket
           */
          await db.ticketsOnOrders.create({
            data: {
              orderId: order.id,
              ticketId: ticket.ticketId,
              count: ticket.count,
            },
          });
        }

        const oldCount = oldTicketOnOrders ? oldTicketOnOrders.count : 0;
        /*
         * Update stock for each ticket.
         */
        if (ticket.count <= 0) {
          await db.ticketsOnOrders.delete({
            where: {
              ticketId_orderId: {
                ticketId: ticket.ticketId,
                orderId: order.id,
              },
            },
          });
        } else if (oldTicketOnOrders) {
          await db.ticketsOnOrders.update({
            where: {
              ticketId_orderId: {
                ticketId: ticket.ticketId,
                orderId: order.id,
              },
            },
            data: {
              count: ticket.count,
            },
          });
        }
        /*
         * Calculate Diffrence between oldCount and newCount
         */
        const diff = oldCount - ticket.count;
        const updatedtTicket = await db.ticket.update({
          data: {
            stock: {
              increment: diff,
            },
          },
          where: {
            id: ticket.ticketId,
          },
        });
        /*
         * Verify that each ticket has engough stock to reserve by Client.
         */
        if (updatedtTicket.stock < 0) {
          throw new Error(
            `Ticket with id:<${ticket.ticketId}> doesn't have enough stock to sell ${ticket.count} units`
          );
        }
        // left time in Minutes
        const leftTime: number =
          (updatedtTicket.departureDate.getTime() - currentTime.getTime()) /
          6000;
        /*
         * Verify that each ticket has at least 30 mintues to departue time.
         */
        if (leftTime < 30) {
          throw new Error(
            `Ticket with id:<${updatedtTicket.id}> has les than 30 minutes to Departure Time`
          );
        }
      }

      // find all tickets on this order
      const allTicketsOnOder = await db.ticket.findMany({
        select: {
          unitPrice: true,
          Orders: {
            select: {
              count: true,
            },
          },
        },
        where: {
          Orders: {
            some: {
              orderId: order.id,
            },
          },
        },
      });

      // Callculate order new totalPrice from each Ticket
      const totalPrice = allTicketsOnOder.reduce(
        (preVal, curVall) =>
          preVal + curVall.unitPrice * curVall.Orders[0].count,
        0
      );

      // Update an Order
      return await db.order.update({
        where: {
          id: order.id,
        },
        data: {
          totalPrice: totalPrice,
          description: description,
        },
      });
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
        const newTransaction = await this.walletService.transfer(
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

  async payOrder(order: Order): Promise<Order> {
    return await db.$transaction(async (db): Promise<Order> => {
      // Check User Wallet
      const { ballance } = await this.walletService.ballance(order.userId);

      if (ballance < order.totalPrice) {
        throw new Error(
          `You Don't have enough ballance in wallet, Increase your wallet ballance first`
        );
      }
      // New Transaction
      const newTransaction = await this.walletService.transfer(
        order.userId,
        -order.totalPrice,
        null,
        order.id
      );

      // Change Order Status
      const updatedOrder = db.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: Status.PAID,
        },
      });
      return updatedOrder;
    });
  }
}

export default OrderService;
