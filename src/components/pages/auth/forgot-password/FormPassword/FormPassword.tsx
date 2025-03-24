import React, {useContext} from 'react';

import {PropsFormPassword} from './interfaces';
import styles from './FormPassword.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {ContextForgotPassword, IContextForgotPassword} from '../context';
import Button from '~/components/common/Button';
import {ShieldSecurity} from 'iconsax-react';
import Popup from '~/components/common/Popup';
import {useRouter} from 'next/router';
import FormSusses from '../FormSusses';
import {httpRequest} from '~/services';
import {useMutation} from '@tanstack/react-query';
import accountServices from '~/services/accountServices';
import md5 from 'md5';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';

function FormPassword({}: PropsFormPassword) {
	const router = useRouter();

	const {open, ...rest} = router.query;

	const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

	const context = useContext<IContextForgotPassword>(ContextForgotPassword);

	const funcChangePassForget = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Lấy lại mât khẩu thành công',
				http: accountServices.changeForgotPassword({
					email: context?.form?.email!,
					otp: context?.form?.otp!,
					newPass: md5(context?.form?.password!),
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				router.replace(
					{
						query: {...router.query, open: 'susses'},
					},
					undefined,
					{scroll: false}
				);
			}
		},
	});

	const handleSubmit = () => {
		if (!regex.test(context?.form?.password!)) {
			return toastWarn({
				msg: 'Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ cái và số',
			});
		}

		return funcChangePassForget.mutate();
	};

	return (
		<div>
			<Loading loading={funcChangePassForget.isLoading} />
			<Form form={context.form} setForm={context.setForm} onSubmit={handleSubmit}>
				<Input
					type='password'
					name='password'
					value={context?.form?.password}
					placeholder='Nhập mật khẩu mới'
					onClean
					isRequired
					icon={<ShieldSecurity size='20' variant='Bold' />}
					label={
						<span>
							Mật khẩu mới <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>

				<Input
					type='password'
					name='rePassword'
					value={context?.form?.rePassword}
					valueConfirm={context?.form?.password}
					placeholder='Nhập lại mật khẩu'
					onClean
					isRequired
					icon={<ShieldSecurity size='20' variant='Bold' />}
					label={
						<span>
							Xác nhận mật khẩu mới <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>

				<div className={styles.btn}>
					<FormContext.Consumer>
						{({isDone}) => (
							<Button primary bold rounded_8 disable={!isDone}>
								Lưu mật khẩu
							</Button>
						)}
					</FormContext.Consumer>
				</div>
			</Form>

			<Popup
				open={open == 'susses'}
				onClose={() =>
					router.replace(
						{
							query: rest,
						},
						undefined,
						{scroll: false}
					)
				}
			>
				<FormSusses />
			</Popup>
		</div>
	);
}

export default FormPassword;
