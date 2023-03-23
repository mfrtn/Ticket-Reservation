import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "../services";
import { UserController } from "../controllers";
import { auth } from "../middlewares";
import { AuthI } from "../interfaces";

const router = Router();

const userController = new UserController(new UserService());

router.use(auth.authJWT);
router.get(
  "/",
  auth.admin,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    userController.index(req, res, next)
);
router.get(
  "/:id",
  auth.self,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    userController.index(req, res, next)
);
router.delete(
  "/:id",
  auth.self,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    userController.destroy(req, res, next)
);
router.patch(
  "/:id",
  auth.self,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    userController.update(req, res, next)
);
router.head(
  "/phone/:phone",
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    userController.findByPhone(req, res, next)
);

export default router;
