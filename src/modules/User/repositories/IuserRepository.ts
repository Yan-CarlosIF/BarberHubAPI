import type { ICreateBarberDTO } from '@/modules/User/dtos/IcreateBarberDTO';
import type { ICreateUserDTO } from '../dtos/IcreateUserDTO';
import type { IRegisterClientDTO } from '../dtos/IregisterClientDTO';
import type { Barber } from '../infra/prisma/entities/Barber';
import type { User } from '../infra/prisma/entities/User';

export interface IUserRepository {
	createClient(data: IRegisterClientDTO): Promise<void>;
	createBarber(data: ICreateBarberDTO): Promise<void>;
	createAdmin(data: ICreateUserDTO): Promise<void>;
	findByEmail(email: string): Promise<User | null>;
	listBarbersByBarbershop(barberShopId: string): Promise<Barber[]>;
}
