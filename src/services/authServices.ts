import axiosClient from '.';

const authServices = {
	login: (
		data: {
			username: string;
			password: string;
			ip: string;
			address: string;
			type: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/login`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default authServices;
