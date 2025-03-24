import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const batchBillServices = {
	getListBill: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			scalesType: number[];
			isBatch: number | null;
			isCreateBatch: number | null;
			status: number[];
			state?: number[];
			timeStart: string | null;
			timeEnd: string | null;
			specificationsUuid: string;
			warehouseUuid: string;
			productTypeUuid: string;
			qualityUuid: string;
			transportType: number | null;
			shipUuid?: string;
			typeCheckDay: number | number;
			scalesStationUuid: string | null;
			truckUuid: string[];
			customerUuid: string;
			listCustomerUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/get-list-bill`, data, {
			cancelToken: tokenAxios,
		});
	},
	endBatchbill: (
		data: {
			uuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/end-batchbill`, data, {
			cancelToken: tokenAxios,
		});
	},
	KTKRejectBatchbill: (
		data: {
			uuid: string[];
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/reject-bill-to-ktk`, data, {
			cancelToken: tokenAxios,
		});
	},
	importBillExcel: (
		data: {
			specificationsUuid: string;
			productTypeUuid: string;
			companyUuid: string;
			lstBills: {
				codeWs: number;
				timeStart: string;
				timeEnd: string;
				licensePalate: string;
				fromUuid: string;
				weight1: number;
				weight2: number;
				weightReal: number;
				dryness: number;
				weightBdmt: number;
				description: string;
			}[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/import_bill_excel`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcel: (
		data: {
			pageSize?: number;
			page?: number | null;
			keyword: string | null;
			isDescending: number;
			typeFind: number;
			isPaging: number;
			scalesType: number[];
			isBatch: number | null;
			transportType: number | null;
			isCreateBatch: number | null;
			status: number[];
			state: number[];
			timeStart: string | null;
			timeEnd: string | null;
			warehouseUuid: string;
			qualityUuid: string;
			specificationsUuid: string;
			productTypeUuid: string;
			storageUuid: string;
			shipUuid: string;
			typeCheckDay: number;
			scalesStationUuid: string;
			documentId: string;
			isExportSpec?: number | null;
			truckUuid: string[];
			customerUuid: string;
			listCustomerUuid: string[];
			companyUuid?: string;
			partnerUuid?: string;
			listIsBatch?: number[];
			typeProduct?: number;
			listCompanyUuid?: string[];
			listPartnerUuid?: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/BatchBill/export-excel-bill`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default batchBillServices;
