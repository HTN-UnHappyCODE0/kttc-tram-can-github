export interface PropsMainPriceTagUpdate {}
export interface IPriceTagUpdate {
	created: string;
	transportType: number;
	timeEnd: string;
	timeStart: string;
	customerUu: {
		code: string;
		name: string;
		typeCus: number;
		uuid: string;
	};
	creatorUu: {
		username: string;
		status: number;
		uuid: string;
	};
	partnerUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	productTypeUu: {
		code: string;
		name: string;
		status: number;
		type: number;
		uuid: string;
	};
	specificationUu: any;
	totalCount: number;
	priceUu: {
		code: string;
		amount: number;
		status: number;
		uuid: string;
	};
	uuid: string;
}
