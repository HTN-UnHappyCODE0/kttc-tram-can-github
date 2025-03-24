import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const wareServices = {
	listProductType: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			type: number[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ware/get-list-product-type`, data, {
			cancelToken: tokenAxios,
		});
	},
	listSpecification: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			qualityUuid?: string;
			productTypeUuid?: string;
			companyUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ware/get-list-specifications`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertSpecifications: (
		data: {
			uuid: string;
			name: string;
			qualityUuid: string;
			productTypeUuid: string;
			description: string;
			colorShow: string;
			items: {
				uuid: string;
				titleType: string;
				rule: number;
				value: number;
			}[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ware/upsert-specifications`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatusSpecifications: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ware/change-status-specifications`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetailSpecifications: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ware/detail-specifications`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertProductType: (
		data: {
			uuid: string;
			name: string;
			description: string;
			colorShow: string;
			type: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ware/upsert-producttype`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatusProductType: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ware/change-status-producttype`, data, {
			cancelToken: tokenAxios,
		});
	},
	listQuality: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ware/get-list-qualities`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertQualities: (
		data: {
			uuid: string;
			name: string;
			colorShow: string;
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ware/upsert-qualities`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatusQualities: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ware/change-status-qualities`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default wareServices;
