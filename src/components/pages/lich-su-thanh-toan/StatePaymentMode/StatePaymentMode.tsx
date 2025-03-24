import {PropsStatePaymentMode} from './interfaces';
import styles from './StatePaymentMode.module.scss';
import {TYPE_TRANSACTION} from '~/constants/config/enum';
import icons from '~/constants/images/icons';
import Image from 'next/image';
import clsx from 'clsx';

function StatePaymentMode({state = TYPE_TRANSACTION.THANH_TOAN}: PropsStatePaymentMode) {
	return (
		<div className={styles.container}>
			<div className={styles.image}>
				{state == TYPE_TRANSACTION.THANH_TOAN && <Image src={icons.dollarCircle} alt='Dollar Circle' />}
				{state == TYPE_TRANSACTION.THU_HOI && <Image src={icons.moneyRecive} alt='Money Recive' />}
				{state == TYPE_TRANSACTION.THUE && <Image src={icons.iconThue} alt='icon thue' />}
			</div>

			<p
				className={clsx({
					[styles.THANH_TOAN]: state == TYPE_TRANSACTION.THANH_TOAN,
					[styles.THU_HOI]: state == TYPE_TRANSACTION.THU_HOI,
					[styles.THUE]: state == TYPE_TRANSACTION.THUE,
				})}
			>
				{state == TYPE_TRANSACTION.THANH_TOAN && 'Thanh toán công nợ'}
				{state == TYPE_TRANSACTION.THU_HOI && 'Thu hồi công nợ'}
				{state == TYPE_TRANSACTION.THUE && 'Thanh toán thuế'}
			</p>
		</div>
	);
}

export default StatePaymentMode;
