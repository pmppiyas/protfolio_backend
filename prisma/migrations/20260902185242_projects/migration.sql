/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_usersEmail_fkey";

-- DropTable
DROP TABLE "public"."posts";

-- CreateTable
CREATE TABLE "projects" (
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

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "projects_serial_idx" ON "projects"("serial");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_usersEmail_fkey" FOREIGN KEY ("usersEmail") REFERENCES "users"("email") ON DELETE SET NULL ON UPDATE CASCADE;
