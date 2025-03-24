export interface PropsMainPageProfile {}

export interface IdetailUser {
	birthDay: string;
	address: string;
	description: string;
	detailAddress: {
		province: {
			uuid: string;
			code: string;
			name: string;
			warehouseUu: null;
		};
		district: {
			uuid: string;
			code: string;
			name: string;
			warehouseUu: null;
		};
		town: {
			uuid: string;
			code: string;
			name: string;
			warehouseUu: null;
		};
	};
	sex: number;
	userOwnerUu: {
		code: string;
		fullName: string;
		uuid: string;
	};
	phoneNumber: string;
	email: string;
	account: string | null;
	linkImage: string;
	regencyUu: IRegencyUu;
	status: number;
	code: string;
	fullName: string;
	provinceOwner: {
		uuid: string;
		code: string;
		name: string;
		warehouseUu: null;
	};
	uuid: string;
}

export interface IRegencyUu {
	code: string | null;
	id: number;
	name: string;
	status: number;
	uuid: string;
}
