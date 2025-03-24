import {toast} from 'react-toastify';

export const toastText = ({msg}: {msg: string}) =>
	toast.info(msg, {
		position: 'top-center',
		autoClose: 2000,
		hideProgressBar: true,
		closeButton: false,
		className: 'toastify-custom',
		icon: false,
	});

export const toastSuccess = ({msg}: {msg: string}) =>
	toast.success(msg, {
		autoClose: 2000,
		hideProgressBar: true,
		closeButton: true,
		className: 'toastify-custom-success',
		icon: false,
	});

export const toastInfo = ({msg}: {msg: string}) =>
	toast.info(msg, {
		autoClose: 2000,
		hideProgressBar: true,
		closeButton: true,
		className: 'toastify-custom-info',
		icon: false,
	});
export const toastWarn = ({msg}: {msg: string}) =>
	toast.warning(msg, {
		autoClose: 2000,
		hideProgressBar: true,
		closeButton: true,
		className: 'toastify-custom-warn',
		icon: false,
	});
export const toastError = ({msg}: {msg: string}) =>
	toast.error(msg, {
		autoClose: 2000,
		hideProgressBar: true,
		closeButton: true,
		className: 'toastify-custom-error',
		icon: false,
	});
