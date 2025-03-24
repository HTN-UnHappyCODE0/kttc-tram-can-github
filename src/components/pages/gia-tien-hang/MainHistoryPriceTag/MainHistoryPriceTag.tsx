import React from 'react';

import {PropsMainHistoryPriceTag} from './interfaces';
import styles from './MainHistoryPriceTag.module.scss';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {IoArrowBackOutline} from 'react-icons/io5';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_TRANSPORT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import priceTagServices from '~/services/priceTagServices';
import {useRouter} from 'next/router';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {IPriceTag} from '../MainPriceTagCurrent/interfaces';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';

function MainHistoryPriceTag({}: PropsMainHistoryPriceTag) {
	const router = useRouter();

	const {_page, _pageSize, _customerUuid, _specUuid, _productTypeUuid, _transportType} = router.query;

	const historyPriceTag = useQuery(
		[QUERY_KEY.table_lich_su_gia_tien_hang, _page, _pageSize, _customerUuid, _specUuid, _productTypeUuid, _transportType],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: priceTagServices.listPriceTagHistory({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						status: null,
						customerUuid: (_customerUuid as string) || '',
						specUuid: (_specUuid as string) || '',
						productTypeUuid: (_productTypeUuid as string) || '',
						priceTagUuid: '',
						state: null,
						transportType: Number(_transportType) || null,
						partnerUuid: '',
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Link href={PATH.GiaTienHangHienTai} className={styles.header_title}>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Lịch sử thay đổi giá tiền </p>
				</Link>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={historyPriceTag?.data?.items || []}
					loading={historyPriceTag?.isLoading}
					noti={<Noti disableButton title='Dữ liệu trống!' des='Hiện tại chưa có lịch sử giá tiền nào, thêm ngay?' />}
				>
					<Table
						data={historyPriceTag?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IPriceTag, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Nhà cung cấp',
								render: (data: IPriceTag) => <>{data?.customerUu?.name || '---'}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: IPriceTag) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Quy cách',
								render: (data: IPriceTag) => <>{data?.specUu?.name || '---'}</>,
							},
							{
								title: 'Vận chuyển',
								render: (data: IPriceTag) => (
									<>
										{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
										{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
									</>
								),
							},
							{
								title: 'Giá tiền thay đổi (VNĐ)',
								render: (data: IPriceTag) => <>{convertCoin(data?.pricetagUu?.amount) || 0} </>,
							},
							{
								title: 'Ngày thay đổi',
								render: (data: IPriceTag) =>
									data.created ? <Moment date={data.created} format='HH:mm, DD/MM/YYYY' /> : '---',
							},
							{
								title: 'Người thay đổi',
								render: (data: IPriceTag) => <>{data?.accountUu?.username || '---'}</>,
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={historyPriceTag?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 200}
					dependencies={[_pageSize, _customerUuid, _specUuid, _productTypeUuid, _transportType]}
				/>
			</div>
		</div>
	);
}

export default MainHistoryPriceTag;
