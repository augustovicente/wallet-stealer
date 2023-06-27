/*
  Warnings:

  - You are about to drop the column `balance` on the `wallets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "balance",
ADD COLUMN     "ballance" INTEGER NOT NULL DEFAULT 0;
