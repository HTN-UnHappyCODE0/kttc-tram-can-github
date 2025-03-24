export interface PropsMainDetailPriceTagUpdate {}
export interface IDetailFixPricetag {
	updateTime: string;
	productTypeUu: {
		code: string;
		name: string;
		status: number;
		uuid: string;
	};
	specificationUu: {name: string; status: number; uuid: string};
	historyFixPriceBill: IhistoryFixPriceBill[];
	totalPage: number;
	created: string;
	transportType: number;
	timeStart: string;
	timeEnd: string;
	customerUu: {code: string; name: string; uuid: string};
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
	totalCount: number;
	priceUu: {
		code: string;
		amount: number;
		status: number;
		uuid: string;
	};
	uuid: string;
}
export interface IhistoryFixPriceBill {
	created: string;
	billUu: {
		status: number;
		code: string;
		uuid: string;
	};
	priceOldUu: {
		code: string;
		amount: number;
		status: number;
		uuid: string;
	};
	uuid: string;
}
