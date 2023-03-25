import { db, Ticket } from "../database";
import {} from "../interfaces";

class TicketService {
  constructor() {}

  // updatedPermittedData(userObject: UserI.UserUpdateI) {
  //   const result = {};

  //   const permittedKeyChange = [
  //     "fname",
  //     "lname",
  //     "phone",
  //     "nationalCode",
  //     "birthday",
  //     "password",
  //     "role",
  //   ];

  //   for (const key of permittedKeyChange) {
  //     if (userObject.hasOwnProperty(key)) {
  //       result[key] = userObject[key];
  //     }
  //   }
  //   return result;
  // }

  async all(): Promise<Ticket[]> {
    return await db.ticket.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async find(id: string): Promise<Ticket> {
    return await db.ticket.findUnique({
      where: {
        id,
      },
    });
  }
}

export default TicketService;
