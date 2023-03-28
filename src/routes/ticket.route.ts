import { Router, Response, NextFunction } from "express";
import { TicketService } from "../services";
import { TicketController } from "../controllers";
import { auth, logAccess } from "../middlewares";
import { AuthI } from "../interfaces";

const router = Router();

const ticketController = new TicketController(new TicketService());

router.use(auth.authJWT, logAccess);
router.get("/", (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
  ticketController.index(req, res, next)
);
router.get(
  "/:id",
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    ticketController.index(req, res, next)
);
router.post(
  "/",
  auth.operator,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    ticketController.create(req, res, next)
);
router.patch(
  "/:id",
  auth.operator,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    ticketController.update(req, res, next)
);
router.delete(
  "/:id",
  auth.operator,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    ticketController.destroy(req, res, next)
);
router.delete(
  "/",
  auth.admin,
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    ticketController.destroyMany(req, res, next)
);
router.post(
  "/query",
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    ticketController.createQuery(req, res, next)
);
router.get(
  "/query/:id",
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    ticketController.runQuery(req, res, next)
);
router.get(
  "/:id/print",
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    ticketController.print(req, res, next)
);

export default router;
