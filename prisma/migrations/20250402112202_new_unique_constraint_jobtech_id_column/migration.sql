/*
  Warnings:

  - A unique constraint covering the columns `[jobtechId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_jobtechId_key" ON "Job"("jobtechId");
