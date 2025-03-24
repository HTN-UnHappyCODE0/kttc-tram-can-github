export interface PropsMainPageWorkshop {}
import {IAddress} from '~/constants/config/interfaces';
export interface ICustomer {
	taxCode: string;
	email: string;
	director: string;
	description: string;
	address: string;
	customerSpec: ICustomerSpec[];
	phoneNumber: string;
	isSift: number;
	status: number;
	detailAddress: IAddress;
	partnerUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	warehouseUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	userUu: {
		code: string;
		fullName: string;
		uuid: string;
	};
	code: string;
	name: string;
	uuid: string;
	created: string;
	updated: string;
}

export interface ICustomerSpec {
	status: number;
	specUuid: string;
	productTypeUuid: string;
	uuid: string;
}
