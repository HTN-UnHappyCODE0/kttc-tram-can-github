import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const fixDrynessServices = {
	getListFixDryness: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			billUuid: string;
			customerUuid: string;
			status: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FixDryness/get-list-fix-dryness`, data, {
			cancelToken: tokenAxios,
		});
	},
	acceptFixDryness: (
		data: {
			uuid: string[];
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FixDryness/accept-fix-dryness`, data, {
			cancelToken: tokenAxios,
		});
	},
	removeFixDryness: (
		data: {
			uuid: string[];
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FixDryness/remove-fix-dryness`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default fixDrynessServices;
