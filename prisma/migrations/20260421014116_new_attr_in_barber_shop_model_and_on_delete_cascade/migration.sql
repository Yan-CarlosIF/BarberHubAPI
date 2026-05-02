/*
  Warnings:

  - Added the required column `latitude` to the `BarberShop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `BarberShop` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BarberShopImageType" AS ENUM ('LOGO', 'COVER', 'GALLERY');

-- DropForeignKey
ALTER TABLE "Barber" DROP CONSTRAINT "Barber_barber_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_barber_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_barber_shop_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_service_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_barber_shop_id_fkey";

-- AlterTable
ALTER TABLE "BarberShop" ADD COLUMN     "latitude" DECIMAL(9,6) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(9,6) NOT NULL;

-- CreateTable
CREATE TABLE "BarberShopImage" (
    "id" TEXT NOT NULL,
    "barber_shop_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "file_name" VARCHAR(255),
    "mime_type" VARCHAR(100),
    "size_in_bytes" INTEGER,
    "type" "BarberShopImageType" NOT NULL DEFAULT 'GALLERY',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BarberShopImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "barber_shop_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BarberShopImage_barber_shop_id_idx" ON "BarberShopImage"("barber_shop_id");

-- CreateIndex
CREATE INDEX "BarberShopImage_barber_shop_id_type_idx" ON "BarberShopImage"("barber_shop_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_barber_shop_id_client_id_key" ON "Rating"("barber_shop_id", "client_id");

-- CreateIndex
CREATE INDEX "BarberShop_latitude_longitude_idx" ON "BarberShop"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "BarberShopImage" ADD CONSTRAINT "BarberShopImage_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "BarberShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
