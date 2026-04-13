import type { IBarberAvailabilityRepository } from '@modules/Barber/repositories/IBarberAvailabilityRepository';
import type { IBarberBlockRepository } from '@modules/Barber/repositories/IBarberBlockRepository';
import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import type { ICreateScheduleBodyDTO } from '@modules/Schedule/dtos/ICreateScheduleDTO';
import type { IScheduleRepository } from '@modules/Schedule/repositories/IScheduleRepository';
import type { IServiceRepository } from '@modules/Service/repositories/IServiceRepository';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { isValidUUID } from '@utils/isValidUUID';
import { inject, injectable } from 'tsyringe';

interface IRequest extends ICreateScheduleBodyDTO {
  barberShopId: string;
  userId: string;
}

const WEEK_DAYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] as const;

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const newMins = (totalMinutes % 60).toString().padStart(2, '0');
  return `${newHours}:${newMins}`;
}

@injectable()
export class CreateScheduleService {
  constructor(
    @inject('ScheduleRepository')
    private scheduleRepository: IScheduleRepository,
    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
    @inject('BarberAvailabilityRepository')
    private barberAvailabilityRepository: IBarberAvailabilityRepository,
    @inject('BarberBlockRepository')
    private barberBlockRepository: IBarberBlockRepository,
    @inject('BarberShopRepository')
    private barberShopRepository: IBarberShopRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute({
    barberShopId,
    userId,
    barberId,
    serviceId,
    date,
    startTime,
  }: IRequest): Promise<void> {
    const barberShop = isValidUUID(barberShopId)
      ? await this.barberShopRepository.findById(barberShopId)
      : await this.barberShopRepository.findBySlug(barberShopId);

    if (!barberShop) {
      throw new AppError('Barber shop not found', 404);
    }

    // Resolve User.id → Client.id
    const client = await this.userRepository.findClientByUserId(userId);

    if (!client) {
      throw new AppError('Client profile not found', 404);
    }

    const service = await this.serviceRepository.findById(serviceId);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    if (!service.isActive) {
      throw new AppError('Service is not active', 400);
    }

    const endTime = addMinutesToTime(startTime, service.durationInMinutes);

    // Validate barber availability for the given week day
    const dayOfWeek = WEEK_DAYS[new Date(date).getUTCDay()];

    const availability =
      await this.barberAvailabilityRepository.findByBarberIdAndWeekDay(
        barberId,
        dayOfWeek,
      );

    if (!availability) {
      throw new AppError('Barber is not available on this day', 400);
    }

    if (startTime < availability.startTime || endTime > availability.endTime) {
      throw new AppError('Schedule is outside barber working hours', 400);
    }

    // Check for barber blocks on that date/time
    const block = await this.barberBlockRepository.findByBarberIdAndDateRange(
      barberId,
      date,
      startTime,
      endTime,
    );

    if (block) {
      throw new AppError('Barber has blocked this time slot', 409);
    }

    const conflictingSchedule =
      await this.scheduleRepository.findByBarberAndDateRange(
        barberId,
        date,
        startTime,
        endTime,
      );

    if (conflictingSchedule) {
      throw new AppError(
        'This time slot is already booked for this barber',
        409,
      );
    }

    await this.scheduleRepository.create({
      barberShopId: barberShop.id,
      clientId: client.id,
      barberId,
      serviceId,
      date,
      startTime,
      endTime,
    });
  }
}
