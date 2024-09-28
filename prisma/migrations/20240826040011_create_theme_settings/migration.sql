/*
  Warnings:

  - Made the column `hashedPassword` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "hashedPassword" SET NOT NULL;

-- CreateTable
CREATE TABLE "ThemeSettings" (
    "id" SERIAL NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#262ad7',
    "secondaryColor" TEXT NOT NULL DEFAULT '#ff5733',
    "backgroundColor" TEXT NOT NULL DEFAULT '#f8f9fa',
    "fontFamily" TEXT NOT NULL DEFAULT '''Roboto'', sans-serif',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "customCss" TEXT,
    "typographySettings" JSONB,
    "socialMediaLinks" JSONB,
    "footerText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThemeSettings_pkey" PRIMARY KEY ("id")
);
