import { $Enums, type Client as ClientType } from '@prisma/client';
import { User } from './User';

export class Client implements ClientType {
	id: string = crypto.randomUUID();
	barberShopId: string;
	phone: string;
	birthDate: Date;

	user: User;
	userId: string;

	constructor({
		phone,
		birthDate,
		barberShopId,
		email,
		isActive,
		name,
		password,
	}: Omit<ClientType, 'id' | 'userId'> &
		Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>) {
		this.user = new User({
			email,
			isActive,
			name,
			password,
			barberShopId,
			role: $Enums.Role.CLIENT,
		});
		this.barberShopId = barberShopId;
		this.userId = this.user.id;
		this.phone = phone;
		this.birthDate = birthDate;
	}
}
