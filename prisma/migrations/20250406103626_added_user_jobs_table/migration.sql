-- DropIndex
DROP INDEX "Job_jobtechId_key";

-- CreateTable
CREATE TABLE "User_jobs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "jobtechId" TEXT NOT NULL,

    CONSTRAINT "User_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_jobs_user_id_idx" ON "User_jobs"("user_id");

-- AddForeignKey
ALTER TABLE "User_jobs" ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
