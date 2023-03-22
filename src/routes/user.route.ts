import * as express from "express";
import { UserService } from "../services";
import { UserController } from "../controllers/";
import { auth } from "../middlewares";
import { AuthI } from "../interfaces/";

const router = express.Router();

const userController = new UserController(new UserService());

router.use(auth.authJWT);
router.get(
  "/",
  auth.admin,
  (
    req: AuthI.AuthRequestI,
    res: express.Response,
    next: express.NextFunction
  ) => userController.index(req, res, next)
);
router.get(
  "/:id",
  auth.self,
  (
    req: AuthI.AuthRequestI,
    res: express.Response,
    next: express.NextFunction
  ) => userController.index(req, res, next)
);

export default router;
