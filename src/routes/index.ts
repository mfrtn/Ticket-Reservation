import { Express } from "express";

import authRouter from "./auth.route";
import userRouter from "./user.route";

function apiRouter(expressApp: Express) {
  expressApp.use("/", authRouter);
  expressApp.use("/users", userRouter);
}

export default apiRouter;
