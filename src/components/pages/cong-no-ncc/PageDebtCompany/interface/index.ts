export interface PropsPageDebtCompany {}

export interface IPartnerDebt {
	debtDemo: number;
	debtReal: number;
	tax: number;
	countCustomer: number;
	lastTransaction: {
		code: string;
		status: number;
		totalAmount: number;
		transTime: string;
		creatorUu: string | null;
		uuid: string;
	} | null;
	phoneNumber: string;
	isSift: number;
	detailAddress: any;
	userOwnerUu: any;
	code: string;
	name: string;
	status: number;
	type: number;
	uuid: string;
	budget: number;
	budgetCash: any;
	budgetBank: any;
	address: string;
	totalBillDemo: number;
	totalBillKCS: number;
	companyUu: any;
	debtTotal: number;
	debtKcs: number;
	debt: number;
	director: string;
	isTotal: boolean;
	firstDebt: number;
	totalDebtDemo: number;
	totalDebtKcs: number;
	lastDebt: number;
	totalBudget: number;
	totalBudgetCash: number;
	totalBudgetBank: number;
	debtBefore: number;
	weightMt: number;
	weightBdmt: number;
	money: number;
	moneyReceived: number;
	moneyPay: number;
}
