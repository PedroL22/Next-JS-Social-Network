/*
  Warnings:

  - Made the column `email` on table `Posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_email_fkey";

-- AlterTable
ALTER TABLE "Posts" ALTER COLUMN "email" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
