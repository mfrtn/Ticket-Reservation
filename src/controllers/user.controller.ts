import { Response, NextFunction } from "express";
import { UserService } from "../services";
import { AuthRequestI } from "../interfaces/auth.interface";

class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  async index(req: AuthRequestI, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (id === undefined) {
        const users = await this.userService.all();
        return res.json(users).end();
      } else {
        const user = await this.userService.find(parseInt(id));
        if (user) {
          return res.json(user).end();
        }
      }
      return res.sendStatus(404);
    } catch (error) {
      error.status = 500;
      next(error);
    }
  }
}

export default UserController;
