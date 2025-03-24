import React, {useState} from 'react';

import {IForm, PropsMainForgotPassword} from './interfaces';
import styles from './MainForgotPassword.module.scss';
import {ContextForgotPassword} from '../context';
import FormEmail from '../FormEmail';
import FormPassword from '../FormPassword';

function MainForgotPassword({}: PropsMainForgotPassword) {
	const [type, setType] = useState<number>(0);
	const [form, setFrom] = useState<IForm>({
		email: '',
		otp: '',
		password: '',
		rePassword: '',
	});

	const arrText: {
		title: string;
		des: string;
	}[] = [
		{
			title: 'Quên mật khẩu?',
			des: 'Nhập địa chỉ email liên kết với tài khoản của bạn để lấy lại mật khẩu!',
		},
		{
			title: 'Thiết lập mật khẩu',
			des: 'Mật khẩu mới bao gồm tối thiểu 6 ký tự gồm chữ hoa, chữ thường và số.',
		},
	];

	return (
		<div className={styles.container}>
			<h4 className={styles.title}>{arrText?.[type]?.title}</h4>
			<p className={styles.text}>{arrText?.[type]?.des}</p>

			<div className={styles.main}>
				<ContextForgotPassword.Provider
					value={{
						form: form,
						setForm: setFrom,
						type: type,
						setType: setType,
					}}
				>
					{type == 0 && <FormEmail />}
					{type == 1 && <FormPassword />}
				</ContextForgotPassword.Provider>
			</div>
		</div>
	);
}

export default MainForgotPassword;
