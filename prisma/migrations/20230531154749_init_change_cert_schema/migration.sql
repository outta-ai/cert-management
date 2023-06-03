/*
  Warnings:

  - The `userId` column on the `Certificate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_userId_fkey";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "userId";
ALTER TABLE "Certificate" ADD COLUMN     "userId" UUID[];
