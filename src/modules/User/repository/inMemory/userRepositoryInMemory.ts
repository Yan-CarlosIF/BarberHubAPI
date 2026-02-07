import { $Enums } from '@prisma/client';
import type { ICreateBarberDTO } from '../../dtos/IcreateBarberDTO';
import type { ICreateClientDTO } from '../../dtos/IcreateClientDTO';
import type { ICreateUserDTO } from '../../dtos/IcreateUserDTO';
import { Barber } from '../../infra/prisma/entities/Barber';
import { Client } from '../../infra/prisma/entities/Client';
import { User } from '../../infra/prisma/entities/User';
import type { IUserRepository } from '../IuserRepository';

export class UserRepositoryInMemory implements IUserRepository {
	public clients: Client[] = [];
	public barbers: Barber[] = [];
	public users: User[] = [];

	async createClient({
		email,
		barberShopId,
		birthDate,
		name,
		password,
		phone,
		isActive,
	}: ICreateClientDTO): Promise<void> {
		const client = new Client({
			email,
			barberShopId,
			birthDate,
			name,
			password,
			phone,
			isActive,
		});

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
}
