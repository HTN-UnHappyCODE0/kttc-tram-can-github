import {TYPE_GROUPBY} from '~/constants/config/enum';
import axiosClient from '.';

const dashbroadServices = {
	listMonthlyDebt: (
		data: {
			pageSize: number;
			page: number;
			partnerUuid: string;
			timeStart: string | null;
			timeEnd: string | null;
			groupBy: TYPE_GROUPBY;
			companyUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Dashbroad/get-list-monthly-debt`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcelMonthlyDebt: (
		data: {
			timeStart: string | null;
			timeEnd: string | null;
			companyUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Dashbroad/export-excel-monthly-debt`, data, {
			cancelToken: tokenAxios,
		});
	},
	countBillWeight: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Dashbroad/count-bill-weight`, data, {
			cancelToken: tokenAxios,
		});
	},
	countBillKcs: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Dashbroad/count-bill-kcs`, data, {
			cancelToken: tokenAxios,
		});
	},
	refreshMonthlyDebt: (
		data: {
			partnerUuid: string[];
			timeStart: string | null;
			timeEnd: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Dashbroad/refresh-monthly-debt`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default dashbroadServices;
