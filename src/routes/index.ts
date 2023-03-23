import { Express } from "express";

import authRouter from "./auth.route";
import userRouter from "./user.route";

function apiRouter(expressApp: Express) {
  expressApp.use("/api/v1/auth", authRouter);
  expressApp.use("/api/v1/user", userRouter);
}

export default apiRouter;
