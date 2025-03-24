import axios from 'axios';
import {delay} from '~/common/funcs/delay';
import {getKeyCert} from '~/common/funcs/optionConvert';
import {toastInfo, toastSuccess, toastWarn} from '~/common/funcs/toast';
import {logout} from '~/redux/reducer/auth';
import {setInfoUser} from '~/redux/reducer/user';
import {store} from '~/redux/store';

const axiosClient = axios.create({
	headers: {
		'content-type': 'application/json',
	},
	baseURL: process.env.NODE_ENV == 'development' ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
	timeout: 300000,
	timeoutErrorMessage: 'Timeout error request',
});

axiosClient.interceptors.request.use(async (config) => {
	const token = store.getState().auth.token;
	config.headers.Authorization = token ? 'Bearer ' + token : null;

	if (!(config.data instanceof FormData)) {
		config.data = {
			...getKeyCert(),
			...config.data,
		};
	}

	return config;
});

axiosClient.interceptors.response.use(
	(response: any) => {
		if (response && response.data) {
			return response.data;
		}

		return response;
	},
	(error: any) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		}

		if (!axios.isCancel(error)) throw error;
	}
);
export default axiosClient;

export const httpRequest = async ({
	http,
	setLoading,
	msgSuccess = 'Thành công',
	showMessageSuccess = false,
	showMessageFailed = false,
	onError,
	isList = false,
	isDropdown = false,
	isData = false,
}: {
	http: any;
	setLoading?: (any: any) => void;
	onError?: () => void;
	showMessageSuccess?: boolean;
	showMessageFailed?: boolean;
	msgSuccess?: string;
	isList?: boolean;
	isDropdown?: boolean;
	isData?: boolean;
}) => {
	setLoading && setLoading(() => true);
	try {
		await delay(500);
		const res: any = await http;

		if (res.error.code === 0) {
			showMessageSuccess && msgSuccess && toastSuccess({msg: msgSuccess || res?.error?.message});
			setLoading && setLoading(() => false);

			if (isDropdown) {
				return res?.items || [];
			}

			if (isList) {
				return {
					...res?.data,
					items: res?.items || [],
					pagination: res?.pagination,
				};
			}
			if (isData) {
				return res;
			}
			return res.data || true;
		} else {
			setLoading && setLoading(() => false);
			onError && onError();
			throw res?.error?.message;
		}
	} catch (err: any) {
		if (err?.status === 401 || err?.status === 403) {
			store.dispatch(logout());
			store.dispatch(setInfoUser(null));
		} else if (typeof err == 'string') {
			showMessageFailed && toastWarn({msg: err || 'Có lỗi đã xảy ra!'});
			setLoading && setLoading(() => false);
		} else if (err.code == 'ERR_NETWORK' || err.code == 'ECONNABORTED') {
			showMessageFailed && toastInfo({msg: 'Kiểm tra kết nối internet'});
			setLoading && setLoading(() => false);
		} else {
			showMessageFailed && toastWarn({msg: err?.error?.message || 'Có lỗi đã xảy ra!'});
			setLoading && setLoading(() => false);
		}
	} finally {
		setLoading && setLoading(() => false);
	}
};
