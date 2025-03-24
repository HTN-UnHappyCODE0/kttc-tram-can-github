import {IAddress} from '~/constants/config/interfaces';

export interface PropsPageDetailPartner {}

export interface IDetailPartner {
	budgetCash: number;
	budgetBank: number;
	code: string;
	name: string;
	status: number;
	type: number;
	uuid: string;
	taxCode: string;
	email: string;
	director: string;
	description: string;
	bankName: string;
	bankAccount: string;
	created: string;
	updated: string;
	lstCustomer: any[];
	debtDemo: number;
	debtReal: number;
	tax: number;
	countCustomer: number;
	lastTransaction: {
		code: string;
		status: number;
		totalAmount: number;
		created: string;
		creatorUu: any;
		uuid: string;
	};
	address: string;
	phoneNumber: string;
	isSift: number;
	detailAddress: IAddress;
	userOwnerUu: IUserOwnerUu;
	totalBillDemo: number;
	totalBillKCS: number;
	totalTransactionIn: number;
	totalTransactionOut: number;
	budget: number;
	companyUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};

	debt: number;
	debtBefore: number;
	weightMt: number;
	weightBdmt: number;
	money: number;
	moneyReceived: number;
	moneyPay: number;
	debtTotal: number;
	debtKcs: number;
}

export interface IUserOwnerUu {
	code: string;
	fullName: string;
	uuid: string;
	provinceOwner: string | null;
}
