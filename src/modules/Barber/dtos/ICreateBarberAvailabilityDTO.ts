import { z } from 'zod';

const weekDayEnum = z.enum([
	'SUNDAY',
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
]);

export const createBarberAvailabilityBodySchema = z
	.object({
		weekDay: weekDayEnum,
		startTime: z
			.string()
			.regex(/^\d{2}:\d{2}$/, 'Horário inválido (formato esperado: HH:MM)'),
		endTime: z
			.string()
			.regex(/^\d{2}:\d{2}$/, 'Horário inválido (formato esperado: HH:MM)'),
	})
	.meta({ description: 'Body para definir disponibilidade do barbeiro' });

export type ICreateBarberAvailabilityBodyDTO = z.infer<
	typeof createBarberAvailabilityBodySchema
>;

export const createBarberAvailabilitySchema = z.object({
	barberId: z.uuid(),
	weekDay: weekDayEnum,
	startTime: z.string().regex(/^\d{2}:\d{2}$/),
	endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export type ICreateBarberAvailabilityDTO = z.infer<
	typeof createBarberAvailabilitySchema
>;
