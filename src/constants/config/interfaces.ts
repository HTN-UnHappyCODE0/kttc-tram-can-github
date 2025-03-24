export interface IAddress {
	province: {
		uuid: string;
		code: string;
		name: string;
	};
	district: {
		uuid: string;
		code: string;
		name: string;
	};
	town: {
		uuid: string;
		code: string;
		name: string;
	};
}
