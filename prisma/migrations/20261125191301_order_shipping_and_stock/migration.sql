-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingPaise" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stockReserved" BOOLEAN NOT NULL DEFAULT false;
