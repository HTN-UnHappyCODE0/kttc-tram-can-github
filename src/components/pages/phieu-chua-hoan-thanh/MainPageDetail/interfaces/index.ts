export interface PropsMainPageDetail {}

export interface IDetailDebtBill {
	countWeightSession: number;
	weightSession: IWeightSession[];
	code: string;
	status: number;
	fromUu: {
		status: number;
		userUu: {
			code: string;
			fullName: string;
			provinceOwner: any | null;
			uuid: string;
		};
		detailAddress: {
			province: {
				uuid: string;
				code: string;
				name: string;
			};
			district: any;
			town: any;
		};
		partnerUu: {
			code: string;
			name: string;
			status: number;
			type: number;
			uuid: string;
		};
		code: string;
		name: string;
		uuid: string;
	};
	priceTagUu: {
		code: string;
		amount: number;
		status: number;
		uuid: string;
	};
	weightTotal: number;
	specificationsUu: {
		name: string;
		status: number;
		uuid: string;
	};
	productTypeUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	moneyTotal: number;
	timeStart: string;
	uuid: string;
	pagination: {
		totalCount: number;
		totalPage: number;
	};
}

export interface IWeightSession {
	dryness: number;
	weight1: number;
	weight2: number;
	weightReal: number;
	weightBdmt: number;
	moneyTotal: number;
	truckUu: {
		code: string;
		licensePalate: string;
		status: number;
		uuid: string;
	};
	created: string;
	status: number;
	code: string;
	uuid: string;
}
