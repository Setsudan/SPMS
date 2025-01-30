/*
  Warnings:

  - A unique constraint covering the columns `[promoName]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `promoName` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `graduationYear` on the `Grade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "promoName" TEXT NOT NULL,
DROP COLUMN "graduationYear",
ADD COLUMN     "graduationYear" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Grade_promoName_key" ON "Grade"("promoName");
