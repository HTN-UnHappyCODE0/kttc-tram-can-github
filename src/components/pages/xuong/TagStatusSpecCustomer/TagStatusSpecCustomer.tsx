import {CONFIG_STATE_SPEC_CUSTOMER} from '~/constants/config/enum';
import {PropsTagStatusSpecCustomer} from './interfaces';
import styles from './TagStatusSpecCustomer.module.scss';
import clsx from 'clsx';

function TagStatusSpecCustomer({status}: PropsTagStatusSpecCustomer) {
	return (
		<div
			className={clsx(styles.container, {
				[styles.DANG_CUNG_CAP]: status == CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP,
				[styles.CHUA_CUNG_CAP]: status == CONFIG_STATE_SPEC_CUSTOMER.CHUA_CUNG_CAP,
			})}
		>
			{status == CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP && 'Đang cung cấp'}
			{status == CONFIG_STATE_SPEC_CUSTOMER.CHUA_CUNG_CAP && 'Có thể cung cấp'}
		</div>
	);
}

export default TagStatusSpecCustomer;
