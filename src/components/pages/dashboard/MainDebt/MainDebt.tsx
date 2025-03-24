import React from 'react';

import {PropsMainDebt} from './interfaces';
import styles from './MainDebt.module.scss';
import ItemDashboard from '../ItemDashboard';

function MainDebt({}: PropsMainDebt) {
	return (
		<div className={styles.container}>
			<h5>Công nợ</h5>
			<p className={styles.text}>Thống kê số lượng công nợ trên hệ thống</p>
			<div className={styles.main}>
				<ItemDashboard text='Công nợ chuẩn' value={120000000} color='#FF6838' />
				<div className={styles.col_2}>
					<ItemDashboard text='Công nợ tạm tính' value={20000000} color='#9757D7' />
					<ItemDashboard text='Tổng tiền tạm ứng' value={10000000} color='#2D74FF' />
				</div>
			</div>
		</div>
	);
}

export default MainDebt;
