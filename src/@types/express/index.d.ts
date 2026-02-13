declare namespace Express {
	export interface Request {
		user: {
			id: string;
			name: string;
			email: string;
			role: 'CLIENT' | 'BARBER' | 'ADMIN' | 'SUPER_ADMIN';
			barberShopId?: string;
		};
	}
}
