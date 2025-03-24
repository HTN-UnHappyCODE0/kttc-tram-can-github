import {STATUS_CUSTOMER} from '~/constants/config/enum';
import {PropsTagStatusCustomer} from './interfaces';
import styles from './TagStatusCustomer.module.scss';
import clsx from 'clsx';

function TagStatusCustomer({status}: PropsTagStatusCustomer) {
	return (
		<div
			className={clsx(styles.container, {
				[styles.HOP_TAC]: status == STATUS_CUSTOMER.HOP_TAC,
				[styles.DUNG_HOP_TAC]: status == STATUS_CUSTOMER.DUNG_HOP_TAC,
			})}
		>
			{status == STATUS_CUSTOMER.HOP_TAC && 'Hợp tác'}
			{status == STATUS_CUSTOMER.DUNG_HOP_TAC && 'Dừng hợp tác'}
		</div>
	);
}

export default TagStatusCustomer;
