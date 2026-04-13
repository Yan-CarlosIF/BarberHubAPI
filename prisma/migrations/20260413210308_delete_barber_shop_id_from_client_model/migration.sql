/*
  Warnings:

  - You are about to drop the column `barber_shop_id` on the `Client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_barber_shop_id_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "barber_shop_id";
