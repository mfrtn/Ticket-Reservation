import { Ticket } from "../database";

interface TicketQueryI {
  from?: string;
  to?: string;
  arrival?: string;
  departure?: string;
}

export { TicketQueryI, Ticket };
