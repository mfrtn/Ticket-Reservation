import { Router, Request, Response, NextFunction } from "express";
import { AuthService, UserService } from "../services";
import { AuthController } from "../controllers";
import { auth, logAccess, logRequest } from "../middlewares";
import { AuthI } from "../interfaces";

const router = Router();

const authController = new AuthController(new AuthService(), new UserService());

router.post(
  "/",
  logRequest,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next)
);
router.post(
  "/register",
  logRequest,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next)
);
router.post(
  "/refresh",
  auth.authJWT,
  logAccess,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    authController.refreshToken(req, res, next)
);

export default router;
