import type { IUpdateBarberDTO } from '@modules/User/dtos/IUpdateBarberDTO';
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

	async findById(id: string): Promise<User | null> {
		return this.users.find((user) => user.id === id) ?? null;
	}

	async delete(id: string): Promise<void> {
		this.users = this.users.filter((user) => user.id !== id);
		this.barbers = this.barbers.filter((barber) => barber.id !== id);
		this.clients = this.clients.filter((client) => client.id !== id);
	}

	async updateBarber(data: IUpdateBarberDTO): Promise<void> {
		const barberIndex = this.barbers.findIndex(
			(barber) => barber.id === data.id,
		);
		const userIndex = this.users.findIndex((user) => user.id === data.id);

		if (userIndex === -1) {
			throw new Error('User not found');
		}

		if (barberIndex === -1) {
			throw new Error('Barber not found');
		}

		this.barbers[barberIndex] = {
			...this.barbers[barberIndex],
			...data,
		};

		this.users[userIndex] = {
			...this.users[userIndex],
			...data,
		};
	}
}
