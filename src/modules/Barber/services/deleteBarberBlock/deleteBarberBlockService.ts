import type { IBarberBlockRepository } from '@modules/Barber/repositories/IBarberBlockRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DeleteBarberBlockService {
	constructor(
		@inject('BarberBlockRepository')
		private barberBlockRepository: IBarberBlockRepository,
	) {}

	async execute(barberId: string, blockId: string) {
		const blocks = await this.barberBlockRepository.findAllByBarberId(barberId);

		const block = blocks.find((b) => b.id === blockId);

		if (!block) {
			throw new AppError('Block not found', 404);
		}

		await this.barberBlockRepository.delete(blockId);
	}
}
