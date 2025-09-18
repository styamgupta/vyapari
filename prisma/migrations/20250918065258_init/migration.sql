/*
  Warnings:

  - You are about to drop the column `productId` on the `Selling` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `itemId` to the `Selling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `Selling` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('BUY', 'SELL');

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Rate" DROP CONSTRAINT "Rate_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Rate" DROP CONSTRAINT "Rate_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Selling" DROP CONSTRAINT "Selling_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Selling" DROP COLUMN "productId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" "public"."TransactionType" NOT NULL DEFAULT 'BUY';

-- DropTable
DROP TABLE "public"."Product";

-- DropTable
DROP TABLE "public"."Rate";

-- CreateTable
CREATE TABLE "public"."Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "preference" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Selling" ADD CONSTRAINT "Selling_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
