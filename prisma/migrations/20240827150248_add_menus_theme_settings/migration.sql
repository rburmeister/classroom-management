/*
  Warnings:

  - A unique constraint covering the columns `[headerMenuId]` on the table `ThemeSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[footerMenuId]` on the table `ThemeSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ThemeSettings" ADD COLUMN     "footerMenuId" INTEGER,
ADD COLUMN     "headerMenuId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ThemeSettings_headerMenuId_key" ON "ThemeSettings"("headerMenuId");

-- CreateIndex
CREATE UNIQUE INDEX "ThemeSettings_footerMenuId_key" ON "ThemeSettings"("footerMenuId");

-- AddForeignKey
ALTER TABLE "ThemeSettings" ADD CONSTRAINT "ThemeSettings_headerMenuId_fkey" FOREIGN KEY ("headerMenuId") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeSettings" ADD CONSTRAINT "ThemeSettings_footerMenuId_fkey" FOREIGN KEY ("footerMenuId") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
