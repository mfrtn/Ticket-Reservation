import { db, Transaction } from "../database";

class WalletService {
  constructor() {}

  async deposit(
    userId: string,
    amount: number,
    bankTransId: number
  ): Promise<Transaction> {
    return await db.transaction.create({
      data: {
        userId,
        amount,
        bankTransId,
      },
    });
  }
}

export default WalletService;
