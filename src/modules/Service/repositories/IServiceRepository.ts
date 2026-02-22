import type { ICreateServiceDTO } from '../dtos/ICreateServiceDTO';
import type { IUpdateServiceDTO } from '../dtos/IUpdateServiceDTO';
import type { Service } from '../infra/prisma/entities/Service';

export interface IServiceRepository {
	create(data: ICreateServiceDTO): Promise<void>;
	findById(id: string): Promise<Service | null>;
	findAll(): Promise<Service[]>;
	update(id: string, data: IUpdateServiceDTO): Promise<void>;
	delete(id: string): Promise<void>;
}
