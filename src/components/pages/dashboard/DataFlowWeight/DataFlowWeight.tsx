import React from 'react';

import {PropsDataFlowWeight} from './interfaces';
import styles from './DataFlowWeight.module.scss';
import clsx from 'clsx';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import dashbroadServices from '~/services/dashbroadServices';
import {QUERY_KEY} from '~/constants/config/enum';

function DataFlowWeight({}: PropsDataFlowWeight) {
	const {data: countBillWeight} = useQuery([QUERY_KEY.thong_ke_luong_du_lieu_duyet_khoi_luong], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: dashbroadServices.countBillWeight({}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Luồng dữ liệu duyệt khối lượng:</h3>
			</div>
			<div className={styles.main}>
				<div className={styles.circle}>QUẢN LÝ CÂN</div>
				<div
					className={clsx(styles.arrow, {
						[styles.level_1]: countBillWeight?.billNeedQlkCheck == 0,
						[styles.level_2]: countBillWeight?.billNeedQlkCheck > 0 && countBillWeight?.billNeedQlkCheck < 100,
						[styles.level_3]: countBillWeight?.billNeedQlkCheck >= 100,
					})}
				>
					<div className={styles.arrow_right}></div>
					{countBillWeight?.billNeedQlkCheck > 0 && <p className={styles.text}>{countBillWeight?.billNeedQlkCheck}</p>}
				</div>
				<div className={styles.circle}>KẾ TOÁN KHO</div>
				<div
					className={clsx(styles.arrow, {
						[styles.level_1]: countBillWeight?.billNeedKtkCheck == 0,
						[styles.level_2]: countBillWeight?.billNeedKtkCheck > 0 && countBillWeight?.billNeedKtkCheck < 100,
						[styles.level_3]: countBillWeight?.billNeedKtkCheck >= 100,
					})}
				>
					<div className={styles.arrow_right}></div>
					{countBillWeight?.billNeedKtkCheck > 0 && <p className={styles.text}>{countBillWeight?.billNeedKtkCheck}</p>}
				</div>
				<div className={styles.circle}>KẾ TOÁN CÔNG TY</div>
			</div>
		</div>
	);
}

export default DataFlowWeight;
