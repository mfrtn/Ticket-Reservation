import { Response, NextFunction } from "express";
import { AuthI, ErrorI, UserI } from "../interfaces";
import { PayIRService, WalletService } from "../services";

class WalletController {
  private callbackURL: string;
  private payIRService: PayIRService;
  private walletService: WalletService;

  constructor(payIRService: PayIRService, walletService: WalletService) {
    this.payIRService = payIRService;
    this.walletService = walletService;
    this.callbackURL = "http://127.0.0.1:3000/users/";
  }

  async deposit(req: AuthI.AuthRequestI, res: Response, next: NextFunction) {
    const { amount } = req.body;
    try {
      const result = await this.payIRService.send(amount, this.callbackURL);

      if (result.status === 1) {
        const fakeVerify = await this.payIRService.fakeVerify(req.user.phone);
        if (fakeVerify.status === 1) {
          //Increase Wallet Balance
          const transaction = await this.walletService.deposit(
            req.user.id,
            amount,
            fakeVerify.bankTransId
          );

          return res.json(transaction);
        }
      }
      const error: ErrorI = new Error();
      error.message = "Error Occured";
      error.code = 422;
      return next(error);
    } catch (error) {
      error.code = 400;
      error.message = "Invalid Request!";
      return next(error);
    }
  }

  async getBallance(
    req: AuthI.AuthRequestI,
    res: Response,
    next: NextFunction
  ) {}
}

export default WalletController;
