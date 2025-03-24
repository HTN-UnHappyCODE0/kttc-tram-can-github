import React, {useContext, useEffect, useState} from 'react';

import {PropsFormOTP} from './interfaces';
import styles from './FormOTP.module.scss';
import InputSingle from '~/components/common/InputSingle';
import {ContextForgotPassword, IContextForgotPassword} from '../context';
import clsx from 'clsx';
import fancyTimeFormat from '~/common/funcs/fancyTimeFormat';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import {obfuscateEmail} from '~/common/funcs/optionConvert';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import Loading from '~/components/common/Loading';

function FormOTP({}: PropsFormOTP) {
	const TIME_OTP = 60;

	const router = useRouter();
	const {open, ...rest} = router.query;

	const context = useContext<IContextForgotPassword>(ContextForgotPassword);

	const [countDown, setCoutDown] = useState<number>(TIME_OTP);
	const [resetOtp, setResetOtp] = useState<boolean>(false);

	useEffect(() => {
		if (countDown > 0) {
			const time = setTimeout(() => {
				setCoutDown(countDown - 1);
			}, 1000);
			return () => clearInterval(time);
		}
	}, [countDown]);

	// Gửi lại OTP
	const funcSendOTP = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Mã OTP đã được gửi đến email của bạn',
				http: accountServices.sendOTP({
					email: context?.form?.email!,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setCoutDown(TIME_OTP);
			}
		},
	});

	// FUCN submit OTP
	const funcSubmitOTP = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác thực thành công',
				http: accountServices.enterOTP({
					email: context?.form?.email!,
					otp: context?.form?.otp!,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				context?.setType(1);
				router.replace(
					{
						query: rest,
					},
					undefined,
					{scroll: false}
				);
			}
		},
	});

	const handleSendcode = () => {
		// Reset OTP
		setResetOtp(!resetOtp);

		return funcSendOTP.mutate();
	};

	const handleSubmit = () => {
		// Reset OTP
		setResetOtp(!resetOtp);

		return funcSubmitOTP.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcSendOTP.isLoading || funcSubmitOTP.isLoading} />
			<h4 className={styles.title}>Xác thực mã OTP</h4>
			<p className={styles.text}>
				Một mã xác thực đã được gửi cho bạn qua địa chỉ email: <span>{obfuscateEmail(context?.form?.email!)}</span>
			</p>

			<div className={styles.form}>
				<p className={styles.des}>Nhập mã OTP</p>
				<div className={styles.box_code}>
					<InputSingle onSetValue={context.setForm} name='otp' lenght={6} />
				</div>
				<p className={styles.countDown}>
					Bạn chưa nhận được mã.{' '}
					{countDown > 0 ? (
						<span className={clsx(styles.textGreen, styles.btnOtp)}>Gửi lại OTP ({fancyTimeFormat(countDown)})</span>
					) : (
						<span className={clsx(styles.textGreen, styles.btnOtp)} onClick={handleSendcode}>
							Gửi lại OTP
						</span>
					)}
				</p>

				<div className={styles.btn}>
					<Button primary bold rounded_8 disable={context?.form?.otp?.length! < 6} onClick={handleSubmit}>
						Xác thực Email
					</Button>
				</div>
			</div>
		</div>
	);
}

export default FormOTP;
