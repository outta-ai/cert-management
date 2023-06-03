/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `CertificateLog` table. All the data in the column will be lost.
  - You are about to drop the column `issuedAt` on the `CertificateLog` table. All the data in the column will be lost.
  - You are about to drop the column `printedAt` on the `CertificateLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CertificateLog" DROP COLUMN "expiresAt";
ALTER TABLE "CertificateLog" DROP COLUMN "issuedAt";
ALTER TABLE "CertificateLog" DROP COLUMN "printedAt";
