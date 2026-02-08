/*
  Warnings:

  - You are about to drop the column `barber_shop_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `close_time` on the `barber_shop_opening_hours` table. All the data in the column will be lost.
  - You are about to drop the column `open_time` on the `barber_shop_opening_hours` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Barber` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barber_shop_id` to the `Barber` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barber_shop_id` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `week_day` on the `barber_shop_opening_hours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_barber_shop_id_fkey";

-- AlterTable
ALTER TABLE "Barber" ADD COLUMN     "barber_shop_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "barber_shop_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "barber_shop_id",
ADD COLUMN     "barberShopId" TEXT;

-- AlterTable
ALTER TABLE "barber_shop_opening_hours" DROP COLUMN "close_time",
DROP COLUMN "open_time",
ADD COLUMN     "closeTime" CHAR(5),
ADD COLUMN     "openTime" CHAR(5),
DROP COLUMN "week_day",
ADD COLUMN     "week_day" "WeekDay" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Barber_user_id_key" ON "Barber"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_user_id_key" ON "Client"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "barber_shop_opening_hours_barber_shop_id_week_day_key" ON "barber_shop_opening_hours"("barber_shop_id", "week_day");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "BarberShop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
