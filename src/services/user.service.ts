import { db, Order, User } from "../database";
import { UserI, Status } from "../interfaces";

class UserService {
  constructor() {}

  updatedPermittedData(userObject: UserI.UserUpdateI) {
    const result = {};

    const permittedKeyChange = [
      "fname",
      "lname",
      "phone",
      "nationalCode",
      "birthday",
      "password",
      "role",
    ];

    for (const key of permittedKeyChange) {
      if (userObject.hasOwnProperty(key)) {
        result[key] = userObject[key];
      }
    }
    return result;
  }

  async all(): Promise<User[]> {
    return await db.user.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async find(id: string): Promise<User> {
    return await db.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByPhone(phone: string): Promise<User> {
    return await db.user.findUnique({
      where: {
        phone,
      },
    });
  }

  async update(id: string, userObject: UserI.UserUpdateI): Promise<User> {
    return await db.user.update({
      where: {
        id,
      },
      data: this.updatedPermittedData(userObject),
    });
  }

  async destroy(id: string): Promise<User> {
    return await db.user.delete({
      where: {
        id,
      },
    });
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    return await db.user.update({
      where: {
        id,
      },
      data: {
        avatarUrl,
      },
    });
  }

  async findOrders(userId: string): Promise<Order[]> {
    return await db.order.findMany({
      where: {
        userId,
      },
      include: {
        Tickets: {
          select: {
            count: true,
            Ticket: {
              select: {
                id: true,
                fromLocation: true,
                toLocation: true,
                arrivalDate: true,
                departureDate: true,
              },
            },
          },
        },
      },
    });
  }
}

export default UserService;
