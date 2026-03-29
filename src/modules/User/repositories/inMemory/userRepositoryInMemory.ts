import type { ICreateBarberDTO } from '@modules/Barber/dtos/ICreateBarberDTO';
import type { IUpdateBarberDTO } from '@modules/Barber/dtos/IUpdateBarberDTO';
import { Barber } from '@modules/Barber/infra/prisma/entities/Barber';
import type { BarberShop } from '@modules/BarberShop/infra/prisma/entities/BarberShop';
import { $Enums } from '@prisma/client';
import type { ICreateUserDTO } from '../../dtos/IcreateUserDTO';
import type { IRegisterClientDTO } from '../../dtos/IregisterClientDTO';
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

  async listAdminsByBarbershop(barberShopId: string): Promise<User[]> {
    return this.users.filter((user) => {
      const isAdmin = user.role === $Enums.Role.ADMIN;

      const belongsToBarberShop = user.barberShopId === barberShopId;

      return isAdmin && belongsToBarberShop;
    });
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

  async getUserBarberShop(userId: string): Promise<BarberShop | null> {
    const user = this.users.find((user) => user.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    const barberShopId = this.barbers.find(
      (barber) => barber.user.id === userId,
    )?.barberShopId;

    if (!barberShopId) {
      throw new Error('Barber shop not found');
    }

    return {
      id: barberShopId,
      name: 'Barber Shop',
      slug: 'barber-shop',
      cep: '12345678',
      city: 'City',
      state: 'State',
      street: 'Street',
      createdAt: new Date(),
      description: 'Description',
      email: 'email@email.com',
      phone: '123456789',
    };
  }
}
