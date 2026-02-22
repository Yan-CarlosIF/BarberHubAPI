/*
  Warnings:

  - You are about to drop the column `barberShopId` on the `Barber` table. All the data in the column will be lost.
  - You are about to drop the column `barberShopId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `closeTime` on the `barber_shop_opening_hours` table. All the data in the column will be lost.
  - You are about to drop the column `openTime` on the `barber_shop_opening_hours` table. All the data in the column will be lost.
  - Added the required column `barber_shop_id` to the `Barber` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barber_shop_id` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW');

-- DropForeignKey
ALTER TABLE "Barber" DROP CONSTRAINT "Barber_barberShopId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_barberShopId_fkey";

-- AlterTable
ALTER TABLE "Barber" DROP COLUMN "barberShopId",
ADD COLUMN     "barber_shop_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "barberShopId",
ADD COLUMN     "barber_shop_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "barber_shop_opening_hours" DROP COLUMN "closeTime",
DROP COLUMN "openTime",
ADD COLUMN     "close_time" CHAR(5),
ADD COLUMN     "open_time" CHAR(5);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "barber_shop_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_in_minutes" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarberService" (
    "id" TEXT NOT NULL,
    "barber_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,

    CONSTRAINT "BarberService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "barber_shop_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "barber_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "start_time" CHAR(5) NOT NULL,
    "end_time" CHAR(5) NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BarberService_barber_id_service_id_key" ON "BarberService"("barber_id", "service_id");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberService" ADD CONSTRAINT "BarberService_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberService" ADD CONSTRAINT "BarberService_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "Barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
