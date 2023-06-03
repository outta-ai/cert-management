-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('Completion');

-- CreateTable
CREATE TABLE "Certificate" (
    "id" UUID NOT NULL,
    "name" STRING NOT NULL,
    "content" STRING NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "userId" UUID NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateLog" (
    "id" UUID NOT NULL,
    "certificateId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "printedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificateLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateLog" ADD CONSTRAINT "CertificateLog_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateLog" ADD CONSTRAINT "CertificateLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
