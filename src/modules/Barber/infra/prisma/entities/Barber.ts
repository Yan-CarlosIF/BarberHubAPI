import { User } from '@modules/User/infra/prisma/entities/User';
import { $Enums, type Barber as BarberType } from '@prisma/client';

export class Barber implements BarberType {
	id: string = crypto.randomUUID();
	barberShopId: string | null;
	specialty: string | null;
	user: User;
	userId: string;

	constructor({
		specialty,
		email,
		isActive,
		name,
		password,
		barberShopId,
	}: Omit<BarberType, 'id' | 'userId'> &
		Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>) {
		this.user = new User({
			email,
			isActive,
			name,
			password,
			role: $Enums.Role.BARBER,
			barberShopId,
		});
		this.barberShopId = barberShopId;
		this.specialty = specialty;
		this.userId = this.user.id;
	}
}
