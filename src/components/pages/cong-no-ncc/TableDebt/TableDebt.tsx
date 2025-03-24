import React from 'react';

import {PropsTableDebt} from './interfaces';
import styles from './TableDebt.module.scss';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {convertCoin} from '~/common/funcs/convertCoin';
import router from 'next/router';
import Pagination from '~/components/common/Pagination';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_DATE,
	TYPE_GROUPBY,
} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import dashbroadServices from '~/services/dashbroadServices';
import clsx from 'clsx';
import {convertWeight} from '~/common/funcs/optionConvert';
import {IPageDebtCompany} from '../../tong-hop-cong-no/MainPage/interfaces';
import Moment from 'react-moment';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import FilterCustom from '~/components/common/FilterCustom';
import companyServices from '~/services/companyServices';
import Search from '~/components/common/Search';

function TableDebt({}: PropsTableDebt) {
	const {_page, _pageSize, _keyword, _dateFrom, _companiUuid, _dateTo, _date, _uuid} = router.query;

	const handleChangeCheckBox = (e: any, key: string, value: any) => {
		const {checked} = e.target;

		const {[key]: str, ...rest} = router.query;

		if (checked) {
			return router.replace(
				{
					query: {
						...router.query,
						[key]: value,
					},
				},
				undefined,
				{
					scroll: false,
				}
			);
		} else {
			return null;
		}
	};
	const listCompany = useQuery([QUERY_KEY.dropdown_cong_ty], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: companyServices.listCompany({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listMonthlyDebt = useQuery(
		[QUERY_KEY.table_tong_hop_cong_no_doi_tac, _page, _pageSize, _companiUuid, _date, _keyword, _dateFrom, _dateTo, _uuid],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: dashbroadServices.listMonthlyDebt({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						partnerUuid: (_uuid as string) || '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						groupBy: !_date || Number(_date) == TYPE_GROUPBY.NGAY ? TYPE_GROUPBY.NGAY : TYPE_GROUPBY.THANG,
						companyUuid: (_companiUuid as string) || '',
					}),
				}),
			select(data) {
				return data;
			},
			enabled: !!_uuid,
		}
	);

	return (
		<FlexLayout isPage={false}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					{/* <div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo' />
					</div> */}
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='KV cảng xuất khẩu'
							query='_companiUuid'
							listFilter={listCompany?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.THIS_MONTH} />
					</div>
					<div className={clsx(styles.checkbox_right)}>
						<input
							type='checkbox'
							id='xem_theo_ngay'
							onChange={(e) => handleChangeCheckBox(e, '_date', TYPE_GROUPBY.NGAY)}
							checked={Number(_date) === TYPE_GROUPBY.NGAY || !_date}
						/>
						<label htmlFor='xem_theo_ngay'>Xem theo ngày</label>
					</div>
					<div className={clsx(styles.checkbox_right)}>
						<input
							type='checkbox'
							id='xem_theo_thang'
							onChange={(e) => handleChangeCheckBox(e, '_date', TYPE_GROUPBY.THANG)}
							checked={Number(_date) === TYPE_GROUPBY.THANG}
						/>
						<label htmlFor='xem_theo_thang'>Xem theo tháng</label>
					</div>
				</div>
			</div>

			<FullColumnFlex>
				<DataWrapper
					data={listMonthlyDebt?.data?.items || []}
					loading={listMonthlyDebt?.isLoading}
					noti={<Noti disableButton={true} title='Dữ liệu trống!' des='Danh sách lịch sử thanh toán trống!' />}
				>
					<Table
						fixedHeader={true}
						data={listMonthlyDebt?.data?.items || []}
						column={[
							{
								title: 'Thời gian',
								fixedLeft: true,
								render: (data: IPageDebtCompany) => (
									<p style={{fontWeight: 600}}>
										{data?.daily ? <Moment date={data?.daily} format='DD/MM/YYYY' /> : '---'}
									</p>
								),
							},
							{
								title: (
									<span className={styles.unit}>
										Dư đầu kỳ
										<br />
										(VNĐ)
									</span>
								),
								render: (data: IPageDebtCompany) => <>{convertCoin(data?.totalDebtBefore) || 0}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Lượng tươi
										<br />
										(MT)
									</span>
								),
								render: (data: IPageDebtCompany) => <>{convertWeight(data?.weightMt)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Lượng khô
										<br />
										(BDMT)
									</span>
								),
								render: (data: IPageDebtCompany) => <>{convertWeight(data?.weightBdmt)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Thành tiền
										<br />
										(VNĐ)
									</span>
								),
								render: (data: IPageDebtCompany) => <>{convertCoin(data?.money)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										VAT
										<br />
										(VNĐ)
									</span>
								),
								render: (data: IPageDebtCompany) => <>{convertCoin(data?.tax)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Nộp trả lại
										<br />
										(VNĐ)
									</span>
								),
								render: (data: IPageDebtCompany) => <>{convertCoin(data?.moneyReceived)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Đã thanh toán
										<br />
										(VNĐ)
									</span>
								),
								render: (data: IPageDebtCompany) => <>{convertCoin(data?.moneyPay)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Công nợ phải trả
										<br />
										(VNĐ)
									</span>
								),
								render: (data: IPageDebtCompany) => <>{convertCoin(data?.totalDebt)}</>,
							},
							// {
							// 	title: 'GN+CK',
							// 	render: (data: IPageDebtCompany) => <>{convertCoin(data?.moneyBank)}</>,
							// },
							// {
							// 	title: 'TM',
							// 	render: (data: IPageDebtCompany) => <>{convertCoin(data?.moneyCash)}</>,
							// },
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 200}
					total={listMonthlyDebt?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _date, _keyword, _dateFrom, _companiUuid, _dateTo, _uuid]}
				/>
			</FullColumnFlex>
		</FlexLayout>
	);
}

export default TableDebt;
