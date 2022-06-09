/*
  Warnings:

  - Added the required column `deleted` to the `Fact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Fact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Fact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Fact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Fact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `used` to the `Fact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Fact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fact" ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted" BOOLEAN NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "statusId" CHAR(36) NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "used" BOOLEAN NOT NULL,
ADD COLUMN     "userId" CHAR(36) NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "password" VARCHAR(60) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "verified" BOOLEAN NOT NULL,
    "sentCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
