import type { ICreateUserDTO } from './IcreateUserDTO';

export interface ICreateBarberDTO extends ICreateUserDTO {
	barberShopId: string;
	specialty?: string;
}
