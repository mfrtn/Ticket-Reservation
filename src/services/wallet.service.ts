import { db, Transaction } from "../database";

class WalletService {
  constructor() {}

  async deposit(
    userId: string,
    amount: number,
    bankTransId?: number,
    orderId?: string
  ): Promise<Transaction> {
    return await db.transaction.create({
      data: {
        userId,
        amount,
        bankTransId,
        orderId,
      },
    });
  }
}

export default WalletService;
