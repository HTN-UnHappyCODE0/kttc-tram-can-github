export interface PropsMainPageAll {}

export interface IDebtBill {
	documentId: string;
	isUpdateDocumentId: number;
	code: string;
	status: number;
	state: number;
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

	totalWeight1: number;
	totalWeight2: number;
	drynessAvg: number;
	weightBdmt: number;
	port: string;
	shipUu: {
		code: string;
		licensePalate: string;
		status: number;
		uuid: string;
	};
	truckUu: {
		code: string;
		licensePalate: string;
		status: number;
		uuid: string;
	};

	scalesStationUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	} | null;
	ktkConfirmTime: string;
	timeEnd: string;
	weightSessionUu: any;
}
