/*
  Warnings:

  - A unique constraint covering the columns `[postsId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[commentsId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Likes_postsId_key" ON "Likes"("postsId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_commentsId_key" ON "Likes"("commentsId");
