/*
  Warnings:

  - You are about to drop the `preference` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "preference" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."preference";
