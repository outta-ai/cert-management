-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Admin', 'Member', 'User');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "clerkId" STRING,
    "email" STRING NOT NULL,
    "type" "UserType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");
