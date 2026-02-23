-- CreateTable
CREATE TABLE "BarberAvailability" (
    "id" TEXT NOT NULL,
    "barber_id" TEXT NOT NULL,
    "week_day" "WeekDay" NOT NULL,
    "start_time" CHAR(5) NOT NULL,
    "end_time" CHAR(5) NOT NULL,

    CONSTRAINT "BarberAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarberBlock" (
    "id" TEXT NOT NULL,
    "barber_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "start_time" CHAR(5) NOT NULL,
    "end_time" CHAR(5) NOT NULL,

    CONSTRAINT "BarberBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BarberAvailability" ADD CONSTRAINT "BarberAvailability_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberBlock" ADD CONSTRAINT "BarberBlock_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
