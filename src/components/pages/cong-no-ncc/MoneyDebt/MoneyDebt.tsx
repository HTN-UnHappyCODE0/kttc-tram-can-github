import {PropsMoneyDebt} from './interfaces';
import styles from './MoneyDebt.module.scss';
import {convertCoin} from '~/common/funcs/convertCoin';
import clsx from 'clsx';

function MoneyDebt({value}: PropsMoneyDebt) {
	return <div className={clsx(styles.box_value, {[styles.check]: value < 0})}>{convertCoin(value)}</div>;
}

export default MoneyDebt;
