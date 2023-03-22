import { db, User } from "../database";

class UserService {
  constructor() {}

  async all(): Promise<User[]> {
    return await db.user.findMany();
  }

  async find(id: number): Promise<User> {
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
}

export default UserService;
