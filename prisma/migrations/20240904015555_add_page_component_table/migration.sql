/*
  Warnings:

  - You are about to drop the column `components` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "components";

-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "props" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
