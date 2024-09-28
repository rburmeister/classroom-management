/*
  Warnings:

  - You are about to drop the column `pageId` on the `Component` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_pageId_fkey";

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "pageId";

-- CreateTable
CREATE TABLE "PageComponent" (
    "pageId" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PageComponent_pkey" PRIMARY KEY ("pageId","componentId")
);

-- AddForeignKey
ALTER TABLE "PageComponent" ADD CONSTRAINT "PageComponent_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageComponent" ADD CONSTRAINT "PageComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
