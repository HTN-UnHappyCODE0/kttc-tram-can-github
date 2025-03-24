export interface PropsMainPage {}

export interface IPageDebtCompany {
	weightMt: number;
	weightBdmt: number;
	money: number;
	tax: number;
	moneyReceived: number;
	moneyPay: number;
	totalDebt: number;
	moneyCash: number;
	moneyBank: number;
	debtBeforeUuid: null;
	totalDebtBefore: number;
	partnerUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	debt: number;
	uuid: string;
	daily: string;
	isTotal: boolean;
}
