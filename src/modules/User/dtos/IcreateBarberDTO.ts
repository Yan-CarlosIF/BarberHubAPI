import type { ICreateUserDTO } from './IcreateUserDTO';

export interface ICreateBarberDTO extends ICreateUserDTO {
	specialty?: string;
}
