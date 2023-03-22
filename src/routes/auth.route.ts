import * as express from "express";
import { AuthService, UserService } from "../services";
import { AuthController } from "../controllers/";

const router = express.Router();

const authController = new AuthController(new AuthService(), new UserService());

router.post(
  "/login",
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    authController.login(req, res, next)
);
router.post(
  "/register",
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    authController.register(req, res, next)
);

export default router;
