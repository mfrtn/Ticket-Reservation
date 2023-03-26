import { Router, Response, NextFunction } from "express";
import { OrderService, WalletService } from "../services";
import { OrderController } from "../controllers";
import { auth } from "../middlewares";
import { AuthI } from "../interfaces";

const router = Router();

const orderController = new OrderController(
  new OrderService(new WalletService())
);

router.use(auth.authJWT);
router.get(
  "/",
  auth.admin,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    orderController.index(req, res, next)
);
router.get(
  "/:id",
  auth.operator,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    orderController.index(req, res, next)
);
router.post("/", (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
  orderController.create(req, res, next)
);
router.patch(
  "/:id",
  auth.operator,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    orderController.update(req, res, next)
);
router.patch(
  "/:id/cancel",
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    orderController.cancel(req, res, next)
);
router.patch(
  "/:id/pay",
  auth.operator,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    orderController.payment(req, res, next)
);

export default router;
