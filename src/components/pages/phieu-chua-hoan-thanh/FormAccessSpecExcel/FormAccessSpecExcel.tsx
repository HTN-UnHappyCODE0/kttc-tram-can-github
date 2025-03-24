import React from 'react';

import {PropsFormAccessSpecExcel} from './interfaces';
import styles from './FormAccessSpecExcel.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {FiHelpCircle} from 'react-icons/fi';

function FormAccessSpecExcel({...props}: PropsFormAccessSpecExcel) {
	return (
		<div className={styles.main_export}>
			<div className={styles.iconWarn}>{<FiHelpCircle />}</div>
			<h4 className={styles.title_export}>Lựa chọn</h4>
			<p className={styles.des_export}>bạn có muốn xuất quy cách không ?</p>

			<div className={styles.control_export}>
				<div>
					<Button p_10_24 rounded_8 grey_outline onClick={props.onDeny}>
						Không
					</Button>
				</div>
				<div>
					<Button p_10_24 rounded_8 primary onClick={props.onAccess}>
						Có
					</Button>
				</div>
			</div>

			<div className={styles.icon_close_export} onClick={props.onClose}>
				<IoClose size={24} color='#23262F' />
			</div>
		</div>
	);
}

export default FormAccessSpecExcel;
