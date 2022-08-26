/*
  Warnings:

  - Added the required column `providerID` to the `GraphData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GraphData" ADD COLUMN     "providerID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "district" TEXT,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "district" TEXT,
ADD COLUMN     "state" TEXT;
