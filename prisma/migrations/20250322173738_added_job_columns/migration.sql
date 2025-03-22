/*
  Warnings:

  - You are about to drop the column `adExpiresAt` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `Job` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyURL` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobHeadline` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "adExpiresAt",
DROP COLUMN "company",
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "companyURL" TEXT NOT NULL,
ADD COLUMN     "jobHeadline" TEXT NOT NULL;
