import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, CONFIG_STATUS} from '~/constants/config/enum';
import axiosClient from '.';

const scalesStationServices = {
	listScalesStation: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			companyUuid: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ScalesStation/get-list-scalesstation`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatus: (
		data: {
			uuid: string;
			status: CONFIG_STATUS;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ScalesStation/change-status-scalesstation`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertScalesstation: (
		data: {
			uuid: string;
			name: string;
			code: string;
			address: string;
			description: string;
			phoneNumber: string;
			companyUuid: string;
			provinceId: string;
			dictrictId: string;
			townId: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ScalesStation/upsert-scalesstation`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetail: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/ScalesStation/detail-scalesstation`, data, {
			cancelToken: tokenAxios,
		});
	},
};
export default scalesStationServices;
