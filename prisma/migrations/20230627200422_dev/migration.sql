-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "mnemonic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_account_key" ON "Wallet"("account");
