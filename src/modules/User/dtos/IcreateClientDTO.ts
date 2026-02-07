import type { ICreateUserDTO } from './IcreateUserDTO';

export interface ICreateClientDTO extends ICreateUserDTO {
	phone: string;
	birthDate: Date;
}
