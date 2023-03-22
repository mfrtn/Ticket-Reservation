import { User } from "@prisma/client";
import { db } from "../database";
import { UserI } from "../interfaces";

class AuthService {
  constructor() {}

  async create(userObject: UserI.UserCreateI): Promise<User> {
    return await db.user.create({
      data: userObject,
    });
  }
}

export default AuthService;
