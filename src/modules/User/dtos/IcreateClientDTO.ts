import type { ICreateUserDTO } from './IcreateUserDTO';

export interface ICreateClientDTO extends ICreateUserDTO {
	barberShopId: string;
	phone: string;
	birthDate: Date;
}
