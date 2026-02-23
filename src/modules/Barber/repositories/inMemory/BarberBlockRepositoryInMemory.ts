import type { ICreateBarberBlockDTO } from '@modules/Barber/dtos/ICreateBarberBlockDTO';
import { BarberBlock } from '@modules/Barber/infra/prisma/entities/BarberBlock';
import type { IBarberBlockRepository } from '../IBarberBlockRepository';

export class BarberBlockRepositoryInMemory implements IBarberBlockRepository {
	blocks: BarberBlock[] = [];

	async create({
		barberId,
		date,
		startTime,
		endTime,
	}: ICreateBarberBlockDTO): Promise<void> {
		const block = new BarberBlock({
			barberId,
			date: new Date(date),
			startTime,
			endTime,
		});

		this.blocks.push(block);
	}

	async findAllByBarberId(barberId: string): Promise<BarberBlock[]> {
		return this.blocks.filter((b) => b.barberId === barberId);
	}

	async findByBarberIdAndDateRange(
		barberId: string,
		date: string,
		startTime: string,
		endTime: string,
	): Promise<BarberBlock | null> {
		return (
			this.blocks.find(
				(b) =>
					b.barberId === barberId &&
					b.date.toISOString().slice(0, 10) === date &&
					b.startTime < endTime &&
					b.endTime > startTime,
			) ?? null
		);
	}

	async delete(id: string): Promise<void> {
		const index = this.blocks.findIndex((b) => b.id === id);
		if (index === -1) throw new Error('Block not found');
		this.blocks.splice(index, 1);
	}
}
