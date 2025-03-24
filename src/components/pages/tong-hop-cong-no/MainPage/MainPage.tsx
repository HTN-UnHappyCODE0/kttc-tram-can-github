import React, {useState} from 'react';

import styles from './MainPage.module.scss';
import {IPageDebtCompany, PropsMainPage} from './interfaces';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import router from 'next/router';
import Link from 'next/link';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import dashbroadServices from '~/services/dashbroadServices';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_DATE,
	TYPE_GROUPBY,
	TYPE_PARTNER,
} from '~/constants/config/enum';
import partnerServices from '~/services/partnerServices';
import FilterCustom from '~/components/common/FilterCustom';
import {convertCoin} from '~/common/funcs/convertCoin';
import {convertWeight, timeSubmit} from '~/common/funcs/optionConvert';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import DatePicker from '~/components/common/DatePicker';
import companyServices from '~/services/companyServices';
import Select, {Option} from '~/components/common/Select';

function MainPage({}: PropsMainPage) {
	const {_page, _pageSize, _keyword, _dateFrom, _dateTo, _partnerUuid, _companyUuid} = router.query;

	const [openExportExcel, setOpenExportExcel] = useState<boolean>(false);
	const [timeStart, setTimeStart] = useState<Date | null>(null);
	const [timeEnd, setTimeEnd] = useState<Date | null>(null);
	const [companyUuid, setCompanyUuid] = useState<string | null>(null);
	const [monthDebt, setMonthlDebt] = useState<any[]>([]);

	const listPartner = useQuery([QUERY_KEY.dropdown_nha_cung_cap], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: partnerServices.listPartner({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					userUuid: '',
					status: CONFIG_STATUS.HOAT_DONG,
					provinceId: '',
					type: TYPE_PARTNER.NCC,
				}),
			}),
		select(data) {
			return data;
		},
	});

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
		[QUERY_KEY.table_tong_hop_cong_no, _page, _pageSize, _keyword, _dateFrom, _dateTo, _partnerUuid, _companyUuid],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: dashbroadServices.listMonthlyDebt({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						partnerUuid: (_partnerUuid as string) || '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						groupBy: TYPE_GROUPBY.THOI_GIAN_LOC,
						companyUuid: (_companyUuid as string) || '',
					}),
				}),
			onSuccess: (data) => {
				if (data) {
					setMonthlDebt([
						{...data?.data, index: 0, isTotal: true},
						...data?.items?.map((v: any, index: number) => ({
							...v,
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
		}
	);

	const exportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: dashbroadServices.exportExcelMonthlyDebt({
					timeStart: timeSubmit(timeStart),
					timeEnd: timeSubmit(timeEnd, true),
					companyUuid: companyUuid || '',
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseExportExcel();
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	const handleCloseExportExcel = () => {
		setOpenExportExcel(false);
		setTimeStart(null);
		setTimeEnd(null);
		setCompanyUuid(null);
	};

	const handleExportExcel = () => {
		const dateStart = new Date(timeStart!);
		const dateEnd = new Date(timeSubmit(timeEnd!)!);

		if (dateStart > dateEnd) {
			return toastWarn({msg: 'Bộ lọc không hợp lệ!'});
		}

		return exportExcel.mutate();
	};

	return (
		<div>
			<FlexLayout isPage={true}>
				<Loading loading={exportExcel.isLoading} />
				<div className={styles.header}>
					<div className={styles.main_search}>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='KV cảng xuất khẩu'
								query='_companyUuid'
								listFilter={listCompany?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.name,
								}))}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Công ty'
								query='_partnerUuid'
								listFilter={listPartner?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.name,
								}))}
							/>
						</div>

						<div className={styles.filter}>
							<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.THIS_MONTH} />
						</div>
					</div>
					<div className={styles.list_btn}>
						<Button rounded_2 w_fit p_8_16 green bold onClick={() => setOpenExportExcel(true)}>
							Xuất báo cáo gửi lãnh đạo
						</Button>
					</div>
				</div>

				<FullColumnFlex>
					<DataWrapper
						data={monthDebt || []}
						loading={listMonthlyDebt?.isLoading}
						noti={<Noti disableButton={true} title='Dữ liệu trống!' des='Danh sách tổng hợp công nợ trống!' />}
					>
						<Table
							fixedHeader={true}
							data={monthDebt || []}
							column={[
								{
									title: 'Tên công ty',
									fixedLeft: true,
									isTitle: (data: IPageDebtCompany) => (data?.isTotal ? true : false),
									render: (data: IPageDebtCompany) => (
										<p className={styles.name}>
											{data?.isTotal ? (
												<p className={styles.totalText}>Tổng cộng</p>
											) : (
												<Link href={`/cong-no-ncc/${data?.partnerUu?.uuid}`} className={styles.link}>
													{data?.partnerUu?.name || '---'}
												</Link>
											)}
										</p>
									),
								},

								{
									title: (
										<span className={styles.unit}>
											Dư đầu kỳ <br /> (VNĐ)
										</span>
									),
									isTitle: (data: IPageDebtCompany) => (data?.isTotal ? true : false),
									render: (data: IPageDebtCompany) => <>{convertCoin(data?.totalDebtBefore) || 0}</>,
								},
								{
									title: (
										<span className={styles.unit}>
											Lượng tươi <br /> (MT)
										</span>
									),
									isTitle: (data: IPageDebtCompany) => (data?.isTotal ? true : false),
									render: (data: IPageDebtCompany) => (
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
									isTitle: (data: IPageDebtCompany) => (data?.isTotal ? true : false),
									render: (data: IPageDebtCompany) => (
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
									isTitle: (data: IPageDebtCompany) => (data?.isTotal ? true : false),
									render: (data: IPageDebtCompany) => (
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
									isTitle: (data: IPageDebtCompany) => (data?.isTotal ? true : false),
									render: (data: IPageDebtCompany) => (
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
											Công nợ phải trả <br /> (VNĐ)
										</span>
									),
									isTitle: (data: IPageDebtCompany) => (data?.isTotal ? true : false),
									render: (data: IPageDebtCompany) => <>{convertCoin(data?.totalDebt)}</>,
								},
								{
									title: (
										<span className={styles.unit}>
											Nộp trả lại <br /> (VNĐ)
										</span>
									),
									isTitle: (data: IPageDebtCompany) => (data?.isTotal ? true : false),
									render: (data: IPageDebtCompany) => (
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
									isTitle: (data: IPageDebtCompany) => (data?.isTotal ? true : false),
									render: (data: IPageDebtCompany) => (
										<>
											{data?.isTotal ? (
												<p className={styles.totalText}>{convertCoin(data?.moneyPay)}</p>
											) : (
												convertCoin(data?.moneyPay)
											)}
										</>
									),
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
						total={listMonthlyDebt?.data?.pagination?.totalCount || 0}
						dependencies={[_pageSize, _keyword, _dateFrom, _dateTo, _partnerUuid, _companyUuid]}
					/>
				</FullColumnFlex>
			</FlexLayout>
			<Popup open={openExportExcel} onClose={handleCloseExportExcel}>
				<div className={styles.main_export}>
					<h4 className={styles.title_export}>Xuất báo cáo gửi lãnh đạo</h4>
					<p className={styles.des_export}>Chọn khoảng thời gian muốn xuất báo cáo gửi lãnh đạo</p>

					<div className={styles.time_export}>
						<DatePicker
							label={
								<span>
									Từ ngày <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Chọn ngày'
							value={timeStart}
							onSetValue={setTimeStart}
							name='timeStart'
							onClean={true}
							icon={true}
						/>
						<DatePicker
							label={
								<span>
									Đến ngày <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Chọn ngày'
							value={timeEnd}
							onSetValue={setTimeEnd}
							name='setTimeEnd'
							onClean={true}
							icon={true}
						/>
					</div>
					<div className='mt'>
						<Select
							isSearch
							name='companyUuid'
							placeholder='Chọn KV cảng xuất khẩu'
							value={companyUuid}
							onChange={(e: any) => setCompanyUuid(e.target.value === '' ? null : e.target.value)}
							label={<span>KV cảng xuất khẩu</span>}
						>
							{listCompany?.data?.map((v: any) => (
								<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
							))}
						</Select>
					</div>

					<div className={styles.control_export}>
						<div>
							<Button p_10_24 rounded_2 grey_outline onClick={handleCloseExportExcel}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<Button disable={!timeStart || !timeEnd} p_10_24 rounded_2 primary onClick={handleExportExcel}>
								Xác nhận
							</Button>
						</div>
					</div>

					<div className={styles.icon_close_export} onClick={handleCloseExportExcel}>
						<IoClose size={24} color='#23262F' />
					</div>
				</div>
			</Popup>
		</div>
	);
}

export default MainPage;
