import { db, User } from "../database";
import { UserI } from "../interfaces";

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
      "avatarUrl",
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
    return await db.user.findMany();
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
}

export default UserService;
