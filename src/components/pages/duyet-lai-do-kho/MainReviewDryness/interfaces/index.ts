export interface PropsMainReviewDryness {}

export interface IReviewDryness {
	uuid: string;
	created: string;
	updateTime: string;
	status: number;
	drynessOld: number;
	drynessNew: number;
	weightMt: number;
	weightBdmtOld: number;
	weightBdmtNew: number;
	moneyOld: number;
	moneyNew: number;
	billUu: {
		status: number;
		code: string;
		countWs: number;
		state: number;
		uuid: string;
	};
	customerUu: {
		code: string;
		name: string;
		status: number;
		typeCus: number;
		uuid: string;
	};
	accountUu: {
		username: string;
		status: number;
		uuid: string;
	};
	reporterUu: any;
	description: string;
}
