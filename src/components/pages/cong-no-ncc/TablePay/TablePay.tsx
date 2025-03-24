import React from 'react';

import {PropsTablePay} from './interfaces';
import styles from './TablePay.module.scss';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_DATE, TYPE_TRANSACTION} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import transactionServices from '~/services/transactionServices';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import Popup from '~/components/common/Popup';
import PopupDetailDebtHistory from '../../lich-su-thanh-toan/PopupDetailDebtHistory';
import Link from 'next/link';
import Moment from 'react-moment';
import StatePaymentMode from '../../lich-su-thanh-toan/StatePaymentMode';
import {convertCoin} from '~/common/funcs/convertCoin';
import Noti from '~/components/common/DataWrapper/components/Noti';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';

function TablePay({}: PropsTablePay) {
	const router = useRouter();

	const {_page, _pageSize, _k, _uuid, _typeTranfer, _dateFrom, _dateTo, _uuidTransaction} = router.query;

	const listTransaction = useQuery(
		[QUERY_KEY.table_lich_su_thanh_toan_doi_tac, _page, _pageSize, _k, _uuid, _typeTranfer, _dateFrom, _dateTo],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: transactionServices.listTransaction({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_k as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						status: null,
						type: !!_typeTranfer ? Number(_typeTranfer) : null,
						partnerUuid: (_uuid as string) || '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
					}),
				}),
			select(data) {
				return data;
			},
			enabled: !!_uuid,
		}
	);

	const getTextPaymentMethod = (amountCash: number, amountBank: number, type: number) => {
		if (type == TYPE_TRANSACTION.THUE) {
			return '---';
		} else {
			if (amountCash > 0 && amountBank == 0) {
				return 'Tiền mặt';
			}
			if (amountCash == 0 && amountBank > 0) {
				return 'Chuyển khoản';
			}
			if (amountCash > 0 && amountBank > 0) {
				return 'Tiền mặt + Chuyển khoản';
			}

			return '---';
		}
	};
	return (
		<FlexLayout isPage={false}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_k' placeholder='Tìm kiếm theo mã GD' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Hình thức'
							query='_typeTranfer'
							listFilter={[
								{id: TYPE_TRANSACTION.THU_HOI, name: 'Thu hồi công nợ'},
								{id: TYPE_TRANSACTION.THANH_TOAN, name: 'Thanh toán công nợ'},
								{id: TYPE_TRANSACTION.THUE, name: 'Thanh toán thuế'},
							]}
						/>
					</div>
					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.THIS_MONTH} />
					</div>
				</div>
			</div>

			<FullColumnFlex>
				<DataWrapper
					data={listTransaction?.data?.items || []}
					loading={listTransaction?.isLoading}
					noti={<Noti disableButton={true} title='Dữ liệu trống!' des='Danh sách lịch sử thanh toán trống!' />}
				>
					<Table
						fixedHeader={true}
						data={listTransaction?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã giao dịch',
								fixedLeft: true,
								render: (data: any) => <p style={{fontWeight: 600}}>{data?.code || '---'}</p>,
							},
							{
								title: 'Thời gian',
								render: (data: any) => (
									<p>{data?.transTime ? <Moment date={data?.transTime} format='DD/MM/YYYY' /> : '---'}</p>
								),
							},
							{
								title: 'Hình thức',
								render: (data: any) => (
									<p className={styles.state_pay}>
										<StatePaymentMode state={data?.type} />
									</p>
								),
							},
							{
								title: 'Phương thức',
								render: (data: any) => <>{getTextPaymentMethod(data?.amountCash, data?.amountBank, data?.type)}</>,
							},
							{
								title: 'Số tiền (VNĐ)',
								render: (data: any) => <>{convertCoin(data?.totalAmount)}</>,
							},
							{
								title: 'Tác vụ',
								selectRow: true,
								fixedRight: true,
								render: (data: any) => (
									<Link
										href='#'
										onClick={(e) => {
											e.preventDefault();
											router.replace(
												{
													query: {
														...router.query,
														_uuidTransaction: data?.uuid,
													},
												},
												undefined,
												{
													scroll: false,
												}
											);
										}}
										className={styles.linkdetail}
									>
										Chi tiết
									</Link>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 200}
					total={listTransaction?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _k, _uuid, _typeTranfer, _dateFrom, _dateTo]}
				/>

				<Popup
					open={!!_uuidTransaction}
					onClose={() => {
						const {_uuidTransaction, ...rest} = router.query;

						router.replace({
							pathname: router.pathname,
							query: {
								...rest,
							},
						});
					}}
				>
					<PopupDetailDebtHistory
						onClose={() => {
							const {_uuidTransaction, ...rest} = router.query;

							router.replace({
								pathname: router.pathname,
								query: {
									...rest,
								},
							});
						}}
					/>
				</Popup>
			</FullColumnFlex>
		</FlexLayout>
	);
}

export default TablePay;
