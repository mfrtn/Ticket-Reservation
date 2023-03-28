import { Response, NextFunction, Request } from "express";
import * as fs from "fs";

import { AuthI } from "../interfaces";

const logAccess = async (
  req: AuthI.AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  console.log(
    `User:  ${user.id}
Route:  ${req.baseUrl + req.url}
Agent:  ${req.headers["user-agent"]}
IP:     ${req.socket.remoteAddress}
Time:   ${new Date()}`
  );

  next();
};

const logRequest = (
  req: AuthI.AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    console.log(
      `Route:  ${req.baseUrl + req.url}
Agent:  ${req.headers["user-agent"]}
IP:     ${req.socket.remoteAddress}
Time:   ${new Date()}`
    );
  }

  next();
};

export { logAccess, logRequest };
