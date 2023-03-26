/*
  Warnings:

  - A unique constraint covering the columns `[amount,orderId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Transaction_orderId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_amount_orderId_key" ON "Transaction"("amount", "orderId");
