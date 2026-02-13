/*
  Warnings:

  - You are about to drop the column `barber_shop_id` on the `Barber` table. All the data in the column will be lost.
  - You are about to drop the column `barber_shop_id` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `barberShopId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Barber" DROP CONSTRAINT "Barber_barber_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_barber_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_barberShopId_fkey";

-- AlterTable
ALTER TABLE "Barber" DROP COLUMN "barber_shop_id",
ADD COLUMN     "barberShopId" TEXT;

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "barber_shop_id",
ADD COLUMN     "barberShopId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "barberShopId",
ADD COLUMN     "barber_shop_id" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
