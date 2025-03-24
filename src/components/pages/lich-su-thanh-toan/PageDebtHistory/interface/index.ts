export interface PropsPageDebtHistory {}

export interface ITransaction {
	partnerUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	type: number;
	amountCash: number;
	amountBank: number;
	path: string;
	creatorUu: {
		username: string;
		status: number;
		uuid: string;
	};
	code: string;
	status: number;
	totalAmount: number;
	created: string;
	uuid: string;
	transTime: string;
	description: string;
	transCode: string;
}
