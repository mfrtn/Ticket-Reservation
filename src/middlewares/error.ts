import { Request, Response, NextFunction } from "express";

import { ErrorI } from "../interfaces/";

const errorHandler = (
  error: ErrorI,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (error.code || error.statusCode) {
    return res
      .status(error.code || error.statusCode)
      .json({
        error: {
          status: true,
          code: error.code || error.statusCode,
          message: error.message,
        },
      })
      .end();
  } else {
    next(error);
  }
};

export { errorHandler };
