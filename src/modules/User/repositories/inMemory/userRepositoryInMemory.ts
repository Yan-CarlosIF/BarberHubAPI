import { $Enums } from '@prisma/client';
import type { ICreateBarberDTO } from '../../dtos/IcreateBarberDTO';
import type { ICreateUserDTO } from '../../dtos/IcreateUserDTO';
import type { IRegisterClientDTO } from '../../dtos/IregisterClientDTO';
import { Barber } from '../../infra/prisma/entities/Barber';
import { Client } from '../../infra/prisma/entities/Client';
import { User } from '../../infra/prisma/entities/User';
import type { IUserRepository } from '../IuserRepository';

export class UserRepositoryInMemory implements IUserRepository {
	public clients: Client[] = [];
	public barbers: Barber[] = [];
	public users: User[] = [];

	async createClient(data: IRegisterClientDTO): Promise<void> {
		const client = new Client(data);

		this.users.push(client.user);
		this.clients.push(client);
	}

	async createBarber(data: ICreateBarberDTO): Promise<void> {
		const barber = new Barber({
			...data,
			specialty: data.specialty ?? null,
		});

		this.users.push(barber.user);
		this.barbers.push(barber);
	}

	async createAdmin(data: ICreateUserDTO): Promise<void> {
		const admin = new User({
			...data,
			role: $Enums.Role.ADMIN,
			isActive: true,
		});

		this.users.push(admin);
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.users.find((user) => user.email === email) ?? null;
	}

	async listBarbersByBarbershop(barberShopId: string): Promise<Barber[]> {
		return this.barbers.filter(
			(barber) => barber.barberShopId === barberShopId,
		);
	}
}
