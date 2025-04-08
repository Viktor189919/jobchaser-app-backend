/*
  Warnings:

  - You are about to drop the column `jobtechId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `jobtechId` on the `User_jobs` table. All the data in the column will be lost.
  - Added the required column `job_id` to the `User_jobs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "user_id";

-- DropIndex
DROP INDEX "Job_user_id_idx";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "jobtechId",
DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "User_jobs" DROP COLUMN "jobtechId",
ADD COLUMN     "job_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "User_jobs_job_id_idx" ON "User_jobs"("job_id");

-- AddForeignKey
ALTER TABLE "User_jobs" ADD CONSTRAINT "job_id" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
