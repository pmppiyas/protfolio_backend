/*
  Warnings:

  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."post" DROP CONSTRAINT "post_usersEmail_fkey";

-- DropTable
DROP TABLE "public"."post";

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "thumbnail" TEXT,
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "backendGithubUrl" TEXT,
    "tags" TEXT[],
    "category" TEXT,
    "serial" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usersEmail" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_serial_idx" ON "posts"("serial");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_usersEmail_fkey" FOREIGN KEY ("usersEmail") REFERENCES "users"("email") ON DELETE SET NULL ON UPDATE CASCADE;
