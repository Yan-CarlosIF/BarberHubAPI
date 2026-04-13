import { $Enums, type Client as ClientType } from '@prisma/client';
import { User } from './User';

export class Client implements Omit<ClientType, 'barberShopId'> {
	id: string = crypto.randomUUID();
	phone: string;
	birthDate: Date;

	user: User;
	userId: string;

	constructor({
		phone,
		birthDate,
		email,
		isActive,
		name,
		password,
	}: Omit<ClientType, 'id' | 'userId' | 'barberShopId'> &
		Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>) {
		this.user = new User({
			email,
			isActive,
			name,
			password,
			barberShopId: null,
			role: $Enums.Role.CLIENT,
		});
		this.userId = this.user.id;
		this.phone = phone;
		this.birthDate = birthDate;
	}
}
