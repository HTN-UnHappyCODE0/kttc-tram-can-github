export interface PropsMainDashboard {}

export interface IDashPartnerDebt {
	budget: number;
	budgetCash: number;
	budgetBank: number;
	tax: number;
	lastTransaction: {
		code: string;
		status: number;
		totalAmount: number;
		transTime: string;
		creatorUu: any;
		uuid: string;
	};
	address: string;
	totalBillDemo: number;
	totalBillKCS: number;
	debtDemo: number;
	debtReal: number;
	debt: number;
	debtBefore: number;
	weightMt: number;
	weightBdmt: number;
	money: number;
	moneyReceived: number;
	moneyPay: number;
	debtTotal: number;
	debtKcs: number;
	director: string;
	countCustomer: number;
	phoneNumber: string;
	email: string;
	isSift: number;
	companyUu: null;
	detailAddress: null;
	userOwnerUu: {
		code: string;
		fullName: string;
		provinceOwner: any;
		uuid: string;
	};
	code: string;
	name: string;
	status: number;
	type: number;
	companyUuid: string;
	uuid: string;
	isTotal: boolean;

	firstDebt: number;
	totalDebtDemo: number;
	totalDebtKcs: number;
	lastDebt: number;
	totalBudget: number;
	totalBudgetCash: number;
	totalBudgetBank: number;
}
