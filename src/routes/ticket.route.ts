import { Router, Response, NextFunction } from "express";
import { TicketService } from "../services";
import { TicketController } from "../controllers";
import { auth } from "../middlewares";
import { AuthI } from "../interfaces";

const router = Router();

const ticketController = new TicketController(new TicketService());

router.use(auth.authJWT);
router.get("/", (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
  ticketController.index(req, res, next)
);
router.get(
  "/:id",
  (req: AuthI.AuthRequestI, res: Response, next: NextFunction) =>
    ticketController.index(req, res, next)
);
export default router;
