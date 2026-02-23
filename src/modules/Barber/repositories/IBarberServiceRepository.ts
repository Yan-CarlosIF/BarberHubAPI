import type { BarberService } from '@modules/Service/infra/prisma/entities/BarberService';
import type { IAssignBarberServiceDTO } from '../dtos/IAssignBarberServiceDTO';

export interface IBarberServiceRepository {
	assign(data: IAssignBarberServiceDTO): Promise<void>;
	unassign(barberId: string, serviceId: string): Promise<void>;
	findAllByBarberId(barberId: string): Promise<BarberService[]>;
	findByBarberIdAndServiceId(
		barberId: string,
		serviceId: string,
	): Promise<BarberService | null>;
}
