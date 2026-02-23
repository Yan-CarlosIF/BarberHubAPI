import type { IAssignBarberServiceDTO } from '@modules/Barber/dtos/IAssignBarberServiceDTO';
import { BarberService } from '@modules/Service/infra/prisma/entities/BarberService';
import type { IBarberServiceRepository } from '../IBarberServiceRepository';

export class BarberServiceRepositoryInMemory
	implements IBarberServiceRepository
{
	barberServices: BarberService[] = [];

	async assign({
		barberId,
		serviceId,
	}: IAssignBarberServiceDTO): Promise<void> {
		const barberService = new BarberService({
			barberId,
			serviceId,
		});

		this.barberServices.push(barberService);
	}

	async unassign(barberId: string, serviceId: string): Promise<void> {
		const index = this.barberServices.findIndex(
			(bs) => bs.barberId === barberId && bs.serviceId === serviceId,
		);
		if (index === -1) throw new Error('BarberService not found');
		this.barberServices.splice(index, 1);
	}

	async findAllByBarberId(barberId: string): Promise<BarberService[]> {
		return this.barberServices.filter((bs) => bs.barberId === barberId);
	}

	async findByBarberIdAndServiceId(
		barberId: string,
		serviceId: string,
	): Promise<BarberService | null> {
		return (
			this.barberServices.find(
				(bs) => bs.barberId === barberId && bs.serviceId === serviceId,
			) ?? null
		);
	}
}
