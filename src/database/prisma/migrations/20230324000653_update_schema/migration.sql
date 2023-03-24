/*
  Warnings:

  - A unique constraint covering the columns `[bankTransId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bankTransId" DOUBLE PRECISION,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_bankTransId_key" ON "Transaction"("bankTransId");
