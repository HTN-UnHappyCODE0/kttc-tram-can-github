import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const accountServices = {
	getListAccount: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			roleUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/get-list-account`, data, {
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
		return axiosClient.post(`/Account/change-status-account`, data, {
			cancelToken: tokenAxios,
		});
	},
	changePassword: (
		data: {
			username: string;
			oldPass: string;
			newPass: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/change-password`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeForgotPassword: (
		data: {
			email: string;
			otp: string;
			newPass: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/change_pass_forget`, data, {
			cancelToken: tokenAxios,
		});
	},

	sendOTP: (
		data: {
			email: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/send_otp`, data, {
			cancelToken: tokenAxios,
		});
	},
	enterOTP: (
		data: {
			email: string;
			otp: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/enter_otp`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default accountServices;
