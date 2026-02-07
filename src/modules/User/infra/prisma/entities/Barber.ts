import { $Enums, type Barber as BarberType } from '@prisma/client';
import { User } from './User';

export class Barber implements BarberType {
	id: string = crypto.randomUUID();
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
			barberShopId,
			role: $Enums.Role.BARBER,
		});
		this.userId = this.user.id;
		this.specialty = specialty;
	}
}
