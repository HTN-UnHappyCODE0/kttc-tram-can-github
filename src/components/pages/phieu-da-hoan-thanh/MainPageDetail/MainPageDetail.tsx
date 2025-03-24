import React from 'react';
import {IDetailDebtBill, IWeightSession, PropsMainPageDetail} from './interfaces';
import styles from './MainPageDetail.module.scss';
import Search from '~/components/common/Search';
import DataWrapper from '~/components/common/DataWrapper';
import {useRouter} from 'next/router';
import Table from '~/components/common/Table';
import clsx from 'clsx';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, QUERY_KEY, STATUS_BILL, STATUS_WEIGHT_SESSION} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import debtBillServices from '~/services/debtBillServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import Noti from '~/components/common/DataWrapper/components/Noti';
import GridColumn from '~/components/layouts/GridColumn';
import ItemDashboard from '../../dashboard/ItemDashboard';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';
import {convertWeight, formatDrynessAvg} from '~/common/funcs/optionConvert';

function MainPageDetail({}: PropsMainPageDetail) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _id} = router.query;

	const {data: detailDebtBill, isLoading} = useQuery<IDetailDebtBill>(
		[QUERY_KEY.chi_tiet_cong_no_phieu, _page, _pageSize, _keyword, _id],
		{
			queryFn: () =>
				httpRequest({
					http: debtBillServices.getDetailDebtBill({
						uuid: _id as string,
						isDescending: CONFIG_DESCENDING.IS_DESCENDING,
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						status: [],
					}),
				}),
			select(data) {
				return data;
			},
			enabled: !!_id,
		}
	);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.headerbutton}>
					<Link
						href='#'
						onClick={(e) => {
							e.preventDefault();
							window.history.back();
						}}
						className={styles.header_title}
					>
						<IoArrowBackOutline fontSize={20} fontWeight={600} />
						<p>Chi tiết phiếu hàng {detailDebtBill?.code}</p>
					</Link>
				</div>
				<div className={clsx('mt')}>
					<GridColumn col_4>
						<ItemDashboard isLoading={isLoading} text='Loại hàng' color='' value={detailDebtBill?.productTypeUu?.name} />
						<ItemDashboard isLoading={isLoading} text='Quy cách' color='' value={detailDebtBill?.specificationsUu?.name} />
						<ItemDashboard
							isLoading={isLoading}
							text='Giá tiền'
							color=''
							value={detailDebtBill?.priceTagUu?.amount}
							unit='VNĐ'
						/>
						{detailDebtBill?.status == STATUS_BILL.DA_CAN_CHUA_KCS && (
							<ItemDashboard
								isLoading={isLoading}
								text='Công nợ tạm tính'
								color=''
								value={detailDebtBill?.moneyTotal || 0}
								unit='VNĐ'
							/>
						)}
						{detailDebtBill?.status == STATUS_BILL.DA_KCS && (
							<ItemDashboard
								isLoading={isLoading}
								text='Công nợ chuẩn'
								color=''
								value={detailDebtBill?.moneyTotal || 0}
								unit='VNĐ'
							/>
						)}
						<ItemDashboard isLoading={isLoading} text='Công ty' color='' value={detailDebtBill?.fromUu?.partnerUu?.name!} />
					</GridColumn>
				</div>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã lượt' />
					</div>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={detailDebtBill?.weightSession || []}
					loading={isLoading}
					noti={<Noti disableButton={true} title='Dữ liệu trống!' des='Danh sách lượt cân trống!' />}
				>
					<Table
						data={detailDebtBill?.weightSession || []}
						column={[
							{
								title: 'Số phiếu',
								render: (data: IWeightSession) => <>{data?.code}</>,
							},
							{
								title: 'Trạng thái',
								render: (data: IWeightSession) => (
									<span style={{color: data?.status < STATUS_WEIGHT_SESSION.KCS_XONG ? 'red' : 'blue', fontWeight: 600}}>
										{data?.status < STATUS_WEIGHT_SESSION.KCS_XONG && 'Chưa KCS'}
										{data?.status >= STATUS_WEIGHT_SESSION.KCS_XONG && 'Đã KCS'}
									</span>
								),
							},
							{
								title: 'Biển số xe',
								render: (data: IWeightSession) => <>{data?.truckUu?.licensePalate || '---'}</>,
							},
							{
								title: 'Lượng hàng (MT)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weightReal)}</>,
							},
							{
								title: 'Độ khô (%)',
								render: (data: IWeightSession) => <>{data?.dryness?.toFixed(2) || 48}</>,
							},
							{
								title: 'Quy khô (BDMT)',
								render: (data: IWeightSession) => <>{convertWeight(data?.weightBdmt)}</>,
							},
							{
								title: 'Công nợ (VNĐ)',
								render: (data: IWeightSession) => <>{convertCoin(data?.moneyTotal)}</>,
							},
							{
								title: 'Ngày nhập',
								render: (data: IWeightSession) => (
									<>{data?.created ? <Moment date={data?.created} format='DD/MM/YYYY' /> : '---'}</>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 200}
					total={detailDebtBill?.pagination?.totalCount || 0}
					dependencies={[_pageSize, _keyword, _id]}
				/>
			</div>
		</div>
	);
}

export default MainPageDetail;
