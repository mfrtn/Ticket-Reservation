import { Ticket } from "../database";

interface TicketQueryI {
  from?: string;
  to?: string;
  arrival?: string;
  departure?: string;
}

interface TicketFilterI {
  fromLocation?: string;
  toLocation?: string;
  arrivalDate?: Date;
  departureDate?: Date;
}

export { TicketQueryI, Ticket, TicketFilterI };
