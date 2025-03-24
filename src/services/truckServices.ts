import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, OWNEW_TYPE_TRUCK} from '~/constants/config/enum';
import axiosClient from '.';

const truckServices = {
	listTruck: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			billUuid?: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Truck/get-list-truck`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertTruck: (
		data: {
			uuid: string;
			code: string;
			licensePalate: string;
			minWeight: number;
			maxWeight: number;
			// weight: number;
			ownerType: OWNEW_TYPE_TRUCK;
			trucktype: string;
			managerUuid: string;
			rfidUuid: string[];
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Truck/upsert-truck`, data, {
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
		return axiosClient.post(`/Truck/change-status-truck`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetail: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Truck/detail-truck`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default truckServices;
