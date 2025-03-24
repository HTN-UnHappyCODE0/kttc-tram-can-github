import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const transactionServices = {
	listTransaction: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			partnerUuid: string;
			type: number | null;
			timeStart: string | null;
			timeEnd: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Transaction/list-transaction`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailTransaction: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Transaction/detail-transaction`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertTransaction: (
		data: {
			uuid: string;
			type: number;
			amountCash: number;
			amountBank: number;
			description: string;
			transTime: string;
			partnerUuid: string;
			paths: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Transaction/upsert-transaction`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertTax: (
		data: {
			uuid: string;
			// totalAmount: number;
			taxAmount: number;
			description: string;
			transCode: string;
			partnerUuid: string;
			transTime: string;
			paths: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Transaction/upsert-tax`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatus: (
		data: {
			uuid: string;
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Transaction/change-status-transaction`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default transactionServices;
