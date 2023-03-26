import {
  PrismaClient,
  Role,
  Status,
  User,
  Transaction,
  Ticket,
  Order,
  TicketsOnOrders,
} from "@prisma/client";

const db = new PrismaClient();

export { db, Role, Status, User, Transaction, Ticket, Order, TicketsOnOrders };
