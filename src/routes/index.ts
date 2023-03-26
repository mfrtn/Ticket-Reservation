import { Express } from "express";

import authRouter from "./auth.route";
import userRouter from "./user.route";
import tickRouter from "./ticket.route";
import orderRouter from "./order.route";

function apiRouter(expressApp: Express) {
  expressApp.use("/api/v1/auth", authRouter);
  expressApp.use("/api/v1/user", userRouter);
  expressApp.use("/api/v1/ticket", tickRouter);
  expressApp.use("/api/v1/order", orderRouter);
}

export default apiRouter;
