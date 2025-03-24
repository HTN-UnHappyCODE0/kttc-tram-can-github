import React from 'react';

import {PropsFormSusses} from './interfaces';
import styles from './FormSusses.module.scss';
import {ShieldTick} from 'iconsax-react';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';

function FormSusses({}: PropsFormSusses) {
	return (
		<div className={styles.container}>
			<ShieldTick size='72' color='#51BC2B' variant='Bold' />
			<h4 className={styles.title}>Đổi mật khẩu thành công</h4>
			<div>
				<Button bold rounded_8 p_12_32 href={PATH.Login}>
					Đăng nhập
				</Button>
			</div>
		</div>
	);
}

export default FormSusses;
