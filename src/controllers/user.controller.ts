import { Response, NextFunction } from "express";
import { UserService } from "../services";
import { AuthI, ErrorI, UserI } from "../interfaces";
import AuthController from "./auth.controller";
import { Role } from "../database";

class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  async index(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    try {
      if (id === undefined) {
        const users = await this.userService.all();
        return res.json(users).end();
      } else {
        const user = await this.userService.find(id);
        if (user) {
          return res.json(user).end();
        }
      }
      const error: ErrorI = new Error();
      error.message = "Not Found";
      error.code = 404;
      next(error);
    } catch (error) {
      error.code = 500;
      next(error);
    }
  }

  async findByPhone(
    req: AuthI.AuthRequestI,
    res: Response,
    next: NextFunction
  ) {
    const phone: string = req.params.phone;

    try {
      const user = await this.userService.findByPhone(phone);
      if (user) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      error.code = 500;
      next(error);
    }
  }

  async destroy(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const id: string = req.params.id;

    try {
      const user = await this.userService.destroy(id);
      res.sendStatus(204);
    } catch (error) {
      error.code = 404;
      error.message = "User Profile Not Found";
      next(error);
    }
  }

  async update(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const id: string = req.params.id;
    const inputFileds: UserI.UserUpdateI = req.body;
    if (req.user.role !== Role.ADMIN) {
      delete inputFileds.role;
    }
    if (inputFileds.birthday) {
      inputFileds.birthday = new Date(inputFileds.birthday);
    }
    if (inputFileds.password) {
      inputFileds.password = AuthController.hashedPass(inputFileds.password);
    }

    try {
      const user = await this.userService.update(id, inputFileds);
      return res.json(user);
    } catch (error) {
      error.code = 400;
      error.message = "Invalid Request!";
      next(error);
    }
  }
}

export default UserController;