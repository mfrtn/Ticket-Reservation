import { Express } from "express";

import authRouter from "./auth.route";
import userRouter from "./user.route";
import tickRouter from "./ticket.route";

function apiRouter(expressApp: Express) {
  expressApp.use("/api/v1/auth", authRouter);
  expressApp.use("/api/v1/user", userRouter);
  expressApp.use("/api/v1/ticket", tickRouter);
}

export default apiRouter;
