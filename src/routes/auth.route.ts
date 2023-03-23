import { Router, Request, Response, NextFunction } from "express";
import { AuthService, UserService } from "../services";
import { AuthController } from "../controllers";
import { auth } from "../middlewares";
import { AuthI } from "../interfaces";

const router = Router();

const authController = new AuthController(new AuthService(), new UserService());

router.post("/", (req: Request, res: Response, next: NextFunction) =>
  authController.login(req, res, next)
);
router.post("/register", (req: Request, res: Response, next: NextFunction) =>
  authController.register(req, res, next)
);
router.post(
  "/refresh",
  auth.authJWT,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    authController.refreshToken(req, res, next)
);

export default router;
