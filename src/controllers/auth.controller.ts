import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt";
import * as JWT from "jsonwebtoken";

import { AuthService, UserService } from "../services";
import { AuthI, ErrorI, UserI } from "../interfaces";

class AuthController {
  private authService: AuthService;
  private userService: UserService;

  private saltRounds = 12;

  constructor(authService: AuthService, userService: UserService) {
    this.authService = authService;
    this.userService = userService;
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const validCredential: AuthI.login = req.body;

    try {
      const user: UserI.UserI = await this.userService.findByPhone(
        validCredential.phone
      );
      if (user) {
        if (bcrypt.compareSync(validCredential.password, user.password)) {
          const token: string = JWT.sign(
            { phone: user.phone },
            process.env.SECRET_KEY,
            { expiresIn: Number(process.env.TOKEN_EXPIRE_TIME) }
          );
          return res.status(202).json({
            token,
          });
        }
      }

      const error: ErrorI = new Error();
      error.message = "Phone and password doesn't match";
      error.code = 401;
      next(error);
    } catch (er) {
      const error: ErrorI = new Error();
      error.message = "Invalid Request";
      error.code = 400;
      next(error);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const validUser: UserI.UserCreateI = req.body;
    try {
      const oldUser: UserI.UserI = await this.userService.findByPhone(
        validUser.phone
      );

      if (!oldUser) {
        const hashedPassword = bcrypt.hashSync(
          validUser.password,
          this.saltRounds
        );

        validUser.password = hashedPassword;
        validUser.phone = validUser.phone;

        const newUser = await this.authService.create(validUser);
        return res.status(201).json({
          id: newUser.id,
          status: "succes",
        });
      } else {
        const error: ErrorI = new Error();
        error.message = "This phone is taken by another user";
        error.code = 406;
        next(error);
      }
    } catch (er) {
      const error: ErrorI = new Error();
      error.message = "Invalid Request";
      error.code = 400;
      next(error);
    }
  }
}

export default AuthController;
