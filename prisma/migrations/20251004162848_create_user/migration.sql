-- AlterTable
ALTER TABLE "Blogs" ADD COLUMN     "usersEmail" TEXT;

-- CreateTable
CREATE TABLE "Users" (
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "photo" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("email")
);

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_usersEmail_fkey" FOREIGN KEY ("usersEmail") REFERENCES "Users"("email") ON DELETE SET NULL ON UPDATE CASCADE;
