import { db, Transaction, User } from "../database";

class WalletService {
  constructor() {}

  async transfer(
    userId: string,
    amount: number,
    bankTransId?: number,
    orderId?: string,
    cardNumber?: string,
    description?: string
  ): Promise<Transaction> {
    return await db.transaction.create({
      data: {
        userId,
        amount,
        bankTransId,
        orderId,
        cardNumber,
        description,
      },
    });
  }

  async ballance(userId: string) {
    return await db.$transaction(async (db) => {
      const { _sum } = await db.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId,
        },
      });
      if (_sum.amount) {
        const user = await db.user.update({
          where: {
            id: userId,
          },
          data: {
            ballance: _sum.amount,
          },
        });

        return {
          ballance: user.ballance,
        };
      } else {
        return {
          ballance: 0,
        };
      }
    });
  }
}

export default WalletService;
