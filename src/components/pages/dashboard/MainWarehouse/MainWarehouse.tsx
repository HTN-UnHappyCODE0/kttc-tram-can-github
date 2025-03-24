import React from 'react';

import {PropsMainWarehouse} from './interfaces';
import styles from './MainWarehouse.module.scss';
import ItemDashboard from '../ItemDashboard';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import debtBillServices from '~/services/debtBillServices';

function MainWarehouse({}: PropsMainWarehouse) {
	const {data: dashbroadDebtBill, isLoading} = useQuery([QUERY_KEY.thong_ke_trang_chu_cong_no], {
		queryFn: () =>
			httpRequest({
				http: debtBillServices.dashbroadDebtBill({}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<ItemDashboard
					isLoading={isLoading}
					text='Phiếu chưa KCS'
					value={dashbroadDebtBill?.infoDemo?.weight || 0}
					quantity={dashbroadDebtBill?.infoDemo?.count || 0}
					unit='MT'
					color='#9757D7'
				/>
				<ItemDashboard
					isLoading={isLoading}
					text='Phiếu đã KCS'
					value={dashbroadDebtBill?.infoReal?.weight || 0}
					quantity={Number(dashbroadDebtBill?.infoReal?.count) || 0}
					color='#2CAE39'
					unit='BDMT'
				/>
				<ItemDashboard
					isLoading={isLoading}
					text='Tổng công nợ'
					value={
						dashbroadDebtBill?.infoDemo?.debt + dashbroadDebtBill?.infoReal?.debt + dashbroadDebtBill?.totalDebtPartner?.debt ||
						0
					}
					color='#D04B53'
					unit='VNĐ'
				/>
				<ItemDashboard
					isLoading={isLoading}
					text='Công nợ tạm tính'
					value={dashbroadDebtBill?.infoDemo?.debt || 0}
					color='#9757D7'
					unit='VNĐ'
				/>
				<ItemDashboard
					isLoading={isLoading}
					text='Công nợ chuẩn'
					value={dashbroadDebtBill?.infoReal?.debt || 0}
					color='#2CAE39'
					unit='VNĐ'
				/>
				<ItemDashboard
					isLoading={isLoading}
					text='Tổng tiền thuế'
					value={dashbroadDebtBill?.totalDebtPartner?.tax || 0}
					color='#2D74FF'
					unit='VNĐ'
				/>
			</div>
		</div>
	);
}

export default MainWarehouse;
