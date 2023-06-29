/*
  Warnings:

  - You are about to drop the column `account` on the `wallets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "account",
ADD COLUMN     "network" TEXT NOT NULL DEFAULT '';
