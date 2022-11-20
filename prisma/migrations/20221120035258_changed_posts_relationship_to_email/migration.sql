/*
  Warnings:

  - You are about to drop the column `userId` on the `Posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_userId_fkey";

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
