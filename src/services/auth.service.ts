import { User } from "@prisma/client";
import { db } from "../database";
import { UserI } from "../interfaces";

class AuthService {
  constructor() {}

  createPermittedData(userObject: UserI.UserCreateI): any {
    const result = {};

    const permittedKeyChange = [
      "fname",
      "lname",
      "phone",
      "nationalCode",
      "birthday",
      "password",
      "avatarUrl",
    ];

    for (const key of permittedKeyChange) {
      if (userObject.hasOwnProperty(key)) {
        result[key] = userObject[key];
      }
    }
    return result;
  }

  async create(userObject: UserI.UserCreateI): Promise<User> {
    return await db.user.create({
      data: this.createPermittedData(userObject),
    });
  }
}

export default AuthService;
