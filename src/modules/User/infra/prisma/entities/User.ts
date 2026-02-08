import type { $Enums, User as UserType } from '@prisma/client';

export class User implements UserType {
	id: string = crypto.randomUUID();
	barberShopId: string | null = null;
	role: $Enums.Role;
	isActive: boolean = true;
	name: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;

	constructor({
		email,
		isActive,
		name,
		password,
		role,
		barberShopId,
	}: Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>) {
		this.barberShopId = barberShopId;
		this.role = role;
		this.isActive = isActive;
		this.name = name;
		this.email = email;
		this.password = password;
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}
