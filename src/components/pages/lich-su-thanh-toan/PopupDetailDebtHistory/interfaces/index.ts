export interface PropsPopupDetailDebtHistory {
	onClose: () => void;
}

export interface IDetailTransaction {
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
	path: string[];
	code: string | null;
	status: number;
	amount: number;

	totalAmount: number;
	transTime: string;
	description: string;
	created: string;
	creatorUu: {
		username: string;
		status: number;
		uuid: string;
	};
	uuid: string;
}
