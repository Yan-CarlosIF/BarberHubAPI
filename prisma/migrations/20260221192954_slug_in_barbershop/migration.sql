/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `BarberShop` will be added. If there are existing duplicate values, this will fail.
  - Made the column `barberShopId` on table `Barber` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `slug` to the `BarberShop` table without a default value. This is not possible if the table is not empty.
  - Made the column `barberShopId` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Barber" DROP CONSTRAINT "Barber_barberShopId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_barberShopId_fkey";

-- AlterTable
ALTER TABLE "Barber" ALTER COLUMN "barberShopId" SET NOT NULL;

-- AlterTable
ALTER TABLE "BarberShop" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "barberShopId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BarberShop_slug_key" ON "BarberShop"("slug");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
