import React from 'react';

import {PropsBoxNoti} from './interfaces';
import styles from './BoxNoti.module.scss';
import Moment from 'react-moment';

function BoxNoti({}: PropsBoxNoti) {
	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h4>
					Thông báo <span>(03)</span>
				</h4>
				<p className={styles.readAll}>Đọc tất cả</p>
			</div>

			<div className={styles.main}>
				{Array(20)
					.fill(20)
					.map((_v, i) => (
						<ItemNoti key={i} />
					))}
			</div>
		</div>
	);
}

export default BoxNoti;

function ItemNoti({}: any) {
	return (
		<div className={styles.item}>
			<p className={styles.text}>
				Quản lý kho Nguyễn Văn Cường vừa gửi danh sách Phiếu Phiếu đã KCS .Quản lý kho Nguyễn Văn Cường vừa gửi danh sách Phiếu Phiếu đã KCS .
			</p>
			<p className={styles.time}>
				<Moment fromNow date={'Wed May 15 2024 11:28:03 GMT+0700 (Indochina Time)'} locale='vi' />
			</p>
		</div>
	);
}
