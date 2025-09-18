/*
  Warnings:

  - You are about to drop the column `preference` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Item" DROP COLUMN "preference";

-- CreateTable
CREATE TABLE "public"."preference" (
    "id" SERIAL NOT NULL,
    "preference" TEXT NOT NULL,

    CONSTRAINT "preference_pkey" PRIMARY KEY ("id")
);
