import type { IAssignBarberServiceDTO } from '@modules/Barber/dtos/IAssignBarberServiceDTO';
import type { IBarberServiceRepository } from '@modules/Barber/repositories/IBarberServiceRepository';
import type { BarberService } from '@modules/Service/infra/prisma/entities/BarberService';
import { prisma } from '@shared/infra/prisma/client';

export class BarberServiceRepositoryPrisma implements IBarberServiceRepository {
	async assign({
		barberId,
		serviceId,
	}: IAssignBarberServiceDTO): Promise<void> {
		await prisma.barberService.create({
			data: {
				barberId,
				serviceId,
			},
		});
	}

	async unassign(barberId: string, serviceId: string): Promise<void> {
		await prisma.barberService.deleteMany({
			where: {
				barberId,
				serviceId,
			},
		});
	}

	async findAllByBarberId(barberId: string): Promise<BarberService[]> {
		return await prisma.barberService.findMany({
			where: { barberId },
			include: { service: true },
		});
	}

	async findByBarberIdAndServiceId(
		barberId: string,
		serviceId: string,
	): Promise<BarberService | null> {
		return await prisma.barberService.findFirst({
			where: {
				barberId,
				serviceId,
			},
		});
	}
}
