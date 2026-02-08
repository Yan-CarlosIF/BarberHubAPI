export interface ICreateUserDTO {
	name: string;
	email: string;
	password: string;
	barberShopId: string | null;
	isActive: boolean;
}
