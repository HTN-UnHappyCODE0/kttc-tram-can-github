import React, {Fragment, useState} from 'react';

import {IDashPartnerDebt, PropsMainDashboard} from './interfaces';
import styles from './MainDashboard.module.scss';
import MainWarehouse from '../MainWarehouse';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {convertCoin} from '~/common/funcs/convertCoin';
import MoneyDebt from '~/components/common/MoneyDebt';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import partnerServices from '~/services/partnerServices';
import {useRouter} from 'next/router';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import DataFlowWeight from '../DataFlowWeight';
import DataFlowDryness from '../DataFlowDryness';
import Link from 'next/link';

function MainDashboard({}: PropsMainDashboard) {
	const router = useRouter();

	const {_page, _pageSize} = router.query;
	const [dashPartnerDebt, setDashPartnerDebt] = useState<any[]>([]);

	const {data: dashbroadPartner, isLoading} = useQuery([QUERY_KEY.thong_ke_trang_chu_nha_cung_cap, _page, _pageSize], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: partnerServices.dashbroadPartner({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 200,
					status: null,
					isDescending: CONFIG_DESCENDING.IS_DESCENDING,
					isPaging: CONFIG_PAGING.IS_PAGING,
					keyword: '',
					typeFind: CONFIG_TYPE_FIND.TABLE,
				}),
			}),
		onSuccess: (data) => {
			if (data) {
				setDashPartnerDebt([
					{...data?.data, index: 0, isTotal: true},
					...data?.items?.map((v: any, index: number) => ({
						...v,
						budgetCash: convertCoin(v?.budgetCash),
						budgetBank: convertCoin(v?.budgetBank),
						index: index + 1,
						isChecked: false,
						isTotal: false,
					})),
				]);
			}
		},
		select(data) {
			return data;
		},
	});

	return (
		<Fragment>
			{/* <FlexLayout> */}
			<div className={styles.col_2}>
				<DataFlowWeight />
				<DataFlowDryness />
			</div>
			<MainWarehouse />
			<h4 className={styles.title}>Danh sách công nợ công ty</h4>
			<FullColumnFlex>
				<DataWrapper
					data={dashbroadPartner?.items}
					loading={isLoading}
					noti={<Noti disableButton des='Hiện tại chưa có công nợ công ty nào!' />}
				>
					<Table
						fixedHeader={true}
						data={dashPartnerDebt || []}
						onSetData={setDashPartnerDebt}
						isDisableCheckBox={(data) => !data?.email}
						column={[
							{
								title: 'Mã công ty',
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt) => <>{data?.code}</>,
							},
							{
								title: 'Tên công ty',
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								fixedLeft: true,
								render: (data: IDashPartnerDebt) => (
									<p className={styles.name}>
										{data?.isTotal ? (
											<p className={styles.totalText}>Tổng cộng</p>
										) : (
											<Link href={`/cong-no-ncc/${data?.uuid}`} className={styles.link}>
												{data?.name}
											</Link>
										)}
									</p>
								),
							},

							{
								title: (
									<span className={styles.unit}>
										Dư đầu kỳ <br />
										(VNĐ)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								totalMoney: 100,
								render: (data: IDashPartnerDebt) => (
									<>
										{data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.firstDebt)}</p>
										) : (
											convertCoin(data?.debtBefore)
										)}
									</>
								),
							},
							{
								title: (
									<span className={styles.unit}>
										Lượng tươi <br /> (MT)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt) => (
									<>
										{data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.weightMt)}</p>
										) : (
											convertCoin(data?.weightMt)
										)}
									</>
								),
							},
							{
								title: (
									<span className={styles.unit}>
										Lượng khô <br /> (BDMT)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt) => (
									<>
										{data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.weightBdmt)}</p>
										) : (
											convertCoin(data?.weightBdmt)
										)}
									</>
								),
							},
							{
								title: (
									<span className={styles.unit}>
										Thành tiền <br /> (VNĐ)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt) => (
									<>
										{data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.money)}</p>
										) : (
											convertCoin(data?.money)
										)}
									</>
								),
							},
							{
								title: (
									<span className={styles.unit}>
										VAT
										<br />
										(VNĐ)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt) => (
									<>
										{data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.tax)}</p>
										) : (
											convertCoin(data?.tax)
										)}
									</>
								),
							},
							{
								title: (
									<span className={styles.unit}>
										Nộp trả lại <br /> (VNĐ)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt) => (
									<>
										{data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.moneyReceived)}</p>
										) : (
											convertCoin(data?.moneyReceived)
										)}
									</>
								),
							},
							{
								title: (
									<span className={styles.unit}>
										Đã thanh toán <br />
										(VNĐ)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt) => (
									<>
										{data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.moneyPay)}</p>
										) : (
											convertCoin(data?.moneyPay)
										)}
									</>
								),
							},
							{
								title: (
									<span className={styles.unit}>
										Công nợ phải trả <br /> (VNĐ)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt) => (
									<>
										{data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.lastDebt)}</p>
										) : (
											convertCoin(data?.debtTotal)
										)}
									</>
								),
							},
							// {
							// 	title: (
							// 		<span className={styles.unit}>
							// 			Công nợ tạm tính <br />
							// 			(VNĐ)
							// 		</span>
							// 	),
							// 	isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
							// 	render: (data: IDashPartnerDebt) => (
							// 		<>{data?.isTotal ? <p>{convertCoin(data?.totalDebtDemo)}</p> : convertCoin(data?.debtDemo)}</>
							// 	),
							// },
							// {
							// 	title: (
							// 		<span className={styles.unit}>
							// 			Công nợ chuẩn <br />
							// 			(VNĐ)
							// 		</span>
							// 	),
							// 	isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
							// 	render: (data: IDashPartnerDebt) => (
							// 		<>{data?.isTotal ? <p>{convertCoin(data?.totalDebtKcs)}</p> : convertCoin(data?.debtKcs)}</>
							// 	),
							// },
							// {
							// 	title: (
							// 		<span className={styles.unit}>
							// 			Dư cuối kỳ <br />
							// 			(VNĐ)
							// 		</span>
							// 	),
							// 	isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
							// 	render: (data: IDashPartnerDebt) => (
							// 		<>{data?.isTotal ? <p>{convertCoin(data?.lastDebt)}</p> : convertCoin(data?.debtTotal)}</>
							// 	),
							// },
							{
								title: (
									<span className={styles.unit}>
										Căn tiền chuyển
										<br />
										(VNĐ)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt, index: number) => (
									<>
										{data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.totalBudget)}</p>
										) : (
											convertCoin(data?.budget)
										)}
									</>
								),
							},
							{
								title: (
									<span className={styles.unit}>
										GN+CK <br />
										(VNĐ)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt, rowIndex: any) =>
									data?.isTotal ? (
										<p className={styles.totalText}>{convertCoin(data?.totalBudgetBank)}</p>
									) : (
										convertCoin(data?.budgetBank)
									),
							},
							{
								title: (
									<span className={styles.unit}>
										Tiền mặt <br />
										(VNĐ)
									</span>
								),
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt, rowIndex: any) =>
									data?.isTotal ? (
										<p className={styles.totalText}>{convertCoin(data?.totalBudgetCash)}</p>
									) : (
										convertCoin(data?.budgetCash)
									),
							},

							{
								title: 'Thanh toán gần nhất',
								isTitle: (data: IDashPartnerDebt) => (data?.isTotal ? true : false),
								render: (data: IDashPartnerDebt) =>
									data?.isTotal ? (
										<p></p>
									) : (
										<>
											{data?.lastTransaction ? (
												<p style={{display: 'flex', flexDirection: 'column', gap: 2}}>
													<span>
														<Moment date={data?.lastTransaction?.transTime} format='DD/MM/YYYY' />
													</span>
													<MoneyDebt value={data?.lastTransaction?.totalAmount} />
												</p>
											) : (
												'---'
											)}
										</>
									),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 200}
					total={dashbroadPartner?.pagination?.totalCount}
					dependencies={[_pageSize]}
				/>
			</FullColumnFlex>
			{/* </FlexLayout> */}
		</Fragment>
	);
}

export default MainDashboard;
