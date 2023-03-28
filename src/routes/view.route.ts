import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get(
  "/view/ticket.css",
  (req: Request, res: Response, next: NextFunction) => {
    return res.sendFile(global.__viewdir + "ticket.css");
  }
);

export default router;
