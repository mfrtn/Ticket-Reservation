import { Response, NextFunction, request } from "express";
import * as JWT from "jsonwebtoken";

import { UserI, AuthI, ErrorI } from "../interfaces";
import { UserService } from "../services";
import { Role } from "../database";

const userService = new UserService();

const authJWT = async (
  req: AuthI.AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token: string = authorization.includes("Bearer")
      ? authorization.split(" ")[1]
      : authorization;

    try {
      const playload: any = JWT.verify(token, process.env.SECRET_KEY);
      const phone: string = playload.phone;

      const user: UserI.UserOutputI = await userService.findByPhone(phone);
      // req.user = userDao.userInfoDao(user);

      if (user) {
        req.user = user;
      } else {
        const error: ErrorI = new Error();
        error.message = "Invalid token";
        error.code = 400;
        next(error);
      }

      next();
    } catch (er) {
      const error: ErrorI = new Error();
      error.message = "Invalid token";
      error.code = 400;
      next(error);
    }
  } else {
    const error: ErrorI = new Error();
    error.message = "Put your token in header";
    error.code = 401;
    next(error);
  }
};

const admin = (req: AuthI.AuthRequestI, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new Error("We need use auth middleware first");
  }

  if (req.user.role === Role.ADMIN) {
    next();
  } else {
    const error: ErrorI = new Error();
    error.message = "You are not authorized";
    error.code = 401;
    next(error);
  }
};

const operator = (
  req: AuthI.AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new Error("We need use auth middleware first");
  }

  if (req.user.role === Role.ADMIN || req.user.role === Role.OPERATOR) {
    next();
  } else {
    const error: ErrorI = new Error();
    error.message = "You are not authorized";
    error.code = 401;
    next(error);
  }
};

const self = (req: AuthI.AuthRequestI, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new Error("We need use authenticate user first");
  }
  if (req.user.role === Role.ADMIN || req.user.role === Role.OPERATOR) {
    next();
  } else if (
    req.user.role === Role.CLIENT &&
    (req.params.id === req.user.id || req.params.phone === req.user.phone)
  ) {
    next();
  } else {
    const error: ErrorI = new Error();
    error.message = "It's Forbidden";
    error.code = 403;
    next(error);
  }
};

export { authJWT, admin, operator, self };
