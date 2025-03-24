import React, {useEffect, useState} from 'react';
import {PropsFormChangePassword} from './interfaces';
import styles from './FormChangePassword.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {FormContext, Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import regencyServices from '~/services/regencyServices';
import clsx from 'clsx';
import accountServices from '~/services/accountServices';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';
import md5 from 'md5';

function FormChangePassword({onClose}: PropsFormChangePassword) {
	const {infoUser} = useSelector((state: RootState) => state.user);
	const [form, setForm] = useState<{
		oldpassword: string;
		newpassword: string;
		confirmpassword: string;
	}>({oldpassword: '', newpassword: '', confirmpassword: ''});

	const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

	const funcChangePassword = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa mật khẩu thành công',
				http: accountServices.changePassword({
					username: infoUser?.userName as string,
					oldPass: md5(form?.oldpassword),
					newPass: md5(form?.newpassword),
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				setForm({
					oldpassword: '',
					newpassword: '',
					confirmpassword: '',
				});
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	const handleSubmit = async () => {
		if (form.newpassword !== form.confirmpassword) {
			return toastWarn({msg: 'Mật khẩu mới không khớp'});
		}
		if (!regex.test(form?.newpassword)) {
			return toastWarn({
				msg: 'Mật khẩu mới phải chứa ít nhất 6 ký tự, bao gồm chữ cái và số',
			});
		}
		return funcChangePassword.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={false} />
			<h4>Đổi mật khẩu</h4>
			<Form form={form} setForm={setForm}>
				<div className={clsx('mt')}>
					<Input
						isRequired
						type='password'
						placeholder='Nhập mật khẩu cũ'
						name='oldpassword'
						value={form.oldpassword}
						label={
							<span>
								Mật khẩu cũ<span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
				</div>
				<div className={clsx('mt')}>
					<Input
						isRequired
						type='password'
						placeholder='Nhập mật khẩu mới'
						name='newpassword'
						value={form.newpassword}
						label={
							<span>
								Mật khẩu mới<span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
				</div>
				<div className={clsx('mt')}>
					<Input
						isRequired
						type='password'
						placeholder='Nhập lại mật khẩu'
						name='confirmpassword'
						value={form.confirmpassword}
						label={
							<span>
								Xác nhận mật khẩu<span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
				</div>

				<div className={styles.groupBtnPopup}>
					<Button p_10_24 rounded_2 grey_outline onClick={onClose} maxContent>
						Hủy bỏ
					</Button>

					<FormContext.Consumer>
						{({isDone}) => (
							<Button disable={!isDone} p_10_24 rounded_2 primary onClick={handleSubmit} maxContent>
								Xác nhận
							</Button>
						)}
					</FormContext.Consumer>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default FormChangePassword;
