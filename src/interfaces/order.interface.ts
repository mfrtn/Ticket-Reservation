import { Order, TicketsOnOrders, Status } from "../database";

type OrderCreatI = {
  userId: string;
  totalPrice: number;
  description?: string | null;
};

export { Order, TicketsOnOrders, Status, OrderCreatI };
