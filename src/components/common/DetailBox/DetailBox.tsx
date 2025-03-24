import {PropsDetailBox} from './interfaces';

import styles from './DetailBox.module.scss';
import Link from 'next/link';
import {convertCoin} from '~/common/funcs/convertCoin';
import clsx from 'clsx';

function DetailBox({isConvert = true, value, link, name, action}: PropsDetailBox) {
	return (
		<div className={styles.container}>
			<div className={styles.box_name}>
				<div className={styles.box_nameTitle}>{name}</div>
				{link && (
					<Link href={link} className={styles.box_Detail}>
						Chi tiết
					</Link>
				)}
			</div>

			<div className={styles.action}>{action}</div>

			<div className={clsx(styles.box_value, {[styles.check]: value < 0})}>{isConvert ? convertCoin(value) : value}</div>
		</div>
	);
}

export default DetailBox;
