/*
  Warnings:

  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Wallet";

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "mnemonic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_account_key" ON "wallets"("account");
