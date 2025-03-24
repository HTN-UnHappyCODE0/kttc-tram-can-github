import {CONFIG_DESCENDING} from '~/constants/config/enum';
import axiosClient from '.';

const debtBillServices = {
	getListDebtBill: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number[];
			isDescending: CONFIG_DESCENDING;
			userUuid: string;
			partnerUuid: string;
			timeStart: string | null;
			timeEnd: string | null;
			companyUuid: string;
			productTypeUuid: string;
			specificationsUuid: string;
			scalesStationUuid: string;
			isBatch: number[];
			typeProduct?: number;
			isPaging?: number;
			qualityUuid?: string;
			isUpdateDocumentId?: number;
			listScalesStationUuid?: string[];
			listCompanyUuid?: string[];
			listPartnerUuid?: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/DebtBill/get-list-debt-bill`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetailDebtBill: (
		data: {
			pageSize: number;
			page: number;
			uuid: string;
			keyword: string;
			status: number[];
			isDescending: CONFIG_DESCENDING;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/DebtBill/detail-debt-bill`, data, {
			cancelToken: tokenAxios,
		});
	},
	dashbroadDebtBill: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/DebtBill/dashbroad-debt-bill`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcel: (
		data: {
			partnerUuid: string;
			timeStart: string | null;
			timeEnd: string | null;
			companyUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/DebtBill/export_excel`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcelDebt: (
		data: {
			timeStart: string | null;
			timeEnd: string | null;
			companyUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/DebtBill/export_bill_debt_excel`, data, {
			cancelToken: tokenAxios,
		});
	},
	sendMail: (
		data: {
			partnerUuid: string[];
			timeStart: string | null;
			timeEnd: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/DebtBill/send-mail`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateDocumnetID: (
		data: {
			uuid: string[];
			documentId: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/DebtBill/update-document-id`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default debtBillServices;
