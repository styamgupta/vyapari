/*
  Warnings:

  - The primary key for the `preference` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `preference` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[preference]` on the table `preference` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."preference" DROP CONSTRAINT "preference_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "preference_preference_key" ON "public"."preference"("preference");
