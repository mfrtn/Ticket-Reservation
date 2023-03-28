import { Response, NextFunction, Request } from "express";

import { AuthI } from "../interfaces";
import { accessLogger } from "../utilities";

function logger(req: AuthI.AuthRequestI): string {
  let log = req.user ? `User:   ${req.user.id}\n` : "";
  log += `Route:  ${req.baseUrl + req.url}
Method: ${req.method}
Agent:  ${req.headers["user-agent"]}
IP:     ${req.socket.remoteAddress}
Time:   ${new Date()}
-----------------------------------\n`;
  return log;
}

const logAccess = (
  req: AuthI.AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  accessLogger(logger(req));
  next();
};

const logRequest = (
  req: AuthI.AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  accessLogger(logger(req));
  next();
};

export { logAccess, logRequest };
