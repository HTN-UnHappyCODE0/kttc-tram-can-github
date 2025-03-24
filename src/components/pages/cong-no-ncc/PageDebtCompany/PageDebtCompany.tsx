import React, {Fragment, useEffect, useRef, useState} from 'react';
import styles from './PageDebtCompany.module.scss';
import {IPartnerDebt, PropsPageDebtCompany} from './interface';
import Search from '~/components/common/Search';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import {useRouter} from 'next/router';
import MoneyDebt from '../MoneyDebt';
import Link from 'next/link';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_NAME,
	TYPE_PARTNER,
} from '~/constants/config/enum';
import partnerServices from '~/services/partnerServices';
import {httpRequest} from '~/services';
import Pagination from '~/components/common/Pagination';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import {DiscountShape, DollarCircle, Edit2, MoneyRecive, Personalcard} from 'iconsax-react';
import Popup from '~/components/common/Popup';
import FormPaymentDebt from '../FormPaymentDebt';
import FormPaymentTax from '../FormPaymentTax';
import FormRecoverDebt from '../FormRecoverDebt';

import {useReactToPrint} from 'react-to-print';
import ComponentToPrint from '~/components/common/ComponentToPrint/ComponentToPrint ';
import IconCustom from '~/components/common/IconCustom/IconCustom';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import Button from '~/components/common/Button';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import userServices from '~/services/userServices';
import regencyServices from '~/services/regencyServices';
import FilterCustom from '~/components/common/FilterCustom';
import companyServices from '~/services/companyServices';
import DatePicker from '~/components/common/DatePicker';
import {convertWeight, timeSubmit} from '~/common/funcs/optionConvert';
import {IoClose} from 'react-icons/io5';
import debtBillServices from '~/services/debtBillServices';
import SelectFilterMany from '~/components/common/SelectFilterMany';

const PageDebtCompany = ({}: PropsPageDebtCompany) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _uuid, _type, _userUuid} = router.query;

	const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);
	const [openSendMail, setOpenSendMail] = useState<boolean>(false);
	const [listSelectPartnerDebt, setListSelectPartnerDebt] = useState<any[]>([]);
	const [partnerDebt, setPartnerDebt] = useState<any[]>([]);
	const [timeStart, setTimeStart] = useState<Date | null>(null);
	const [timeEnd, setTimeEnd] = useState<Date | null>(null);
	const [openExportExcel, setOpenExportExcel] = useState<boolean>(false);
	const [timeStartExcel, setTimeStartExcel] = useState<Date | null>(null);
	const [timeEndExcel, setTimeEndExcel] = useState<Date | null>(null);
	const [listCompanyUuid, setListCompanyUuid] = useState<any[]>([]);

	const listPartnerDebt = useQuery([QUERY_KEY.table_cong_no_nha_cung_cap, _userUuid, _page, _pageSize, listCompanyUuid, _keyword], {
		queryFn: () =>
			httpRequest({
				isData: true,
				http: partnerServices.listPartnerDebt({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 200,
					status: 1,
					provinceId: '',
					userUuid: (_userUuid as string) || '',
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					type: TYPE_PARTNER.NCC,
					companyUuid: '',
					listCompanyUuid: listCompanyUuid,
				}),
			}),
		onSuccess: (data) => {
			if (data) {
				setPartnerDebt([
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

	const listRegency = useQuery([QUERY_KEY.dropdown_chuc_vu], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: regencyServices.listRegency({
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

	const listUser = useQuery([QUERY_KEY.dropdown_quan_ly_nhap_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: userServices.listUser({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					provinceIDOwer: '',
					regencyUuid: listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])
						? listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])?.uuid
						: null,
					regencyUuidExclude: '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const funcUpdateBudget = useMutation({
		mutationFn: (body: {uuid: string; budgetBank: number; budgetCash: number}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật chi phí dự tính thành công!',
				http: partnerServices.updateBudget({
					partnerUuid: body.uuid,
					budgetBank: body.budgetBank,
					budgetCash: body.budgetCash,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.table_cong_no_nha_cung_cap]);
			}
		},
		onError(error) {
			return;
		},
	});

	useEffect(() => {
		if (partnerDebt.length > 0) {
			inputRefs.current = Array(partnerDebt.length)
				.fill(null)
				.map((_, i) => inputRefs.current[i] || null);
		}
	}, [partnerDebt]);

	const handleClosePopup = () => {
		const {_uuid, _type, ...rest} = router.query;

		return router.replace(
			{
				pathname: router.pathname,
				query: {
					...rest,
				},
			},
			undefined,
			{shallow: true, scroll: false}
		);
	};

	// const handleKeyEnter = (uuid: string, budgetBank: any, budgetCash: any, event: any, index: number) => {
	// 	if (event.key === 'Enter' || event.keyCode === 13) {
	// 		return funcUpdateBudget.mutate({
	// 			uuid: uuid,
	// 			budgetBank: price(budgetBank),
	// 			budgetCash: price(budgetCash),
	// 		});
	// 	}
	// };

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

	const exportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: partnerServices.exportExcel({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 200,
					status: null,
					provinceId: '',
					userUuid: (_userUuid as string) || '',
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					type: TYPE_PARTNER.NCC,
					companyUuid: '',
					listCompanyUuid: listCompanyUuid,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	const exportExcelTotal = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: debtBillServices.exportExcelDebt({
					timeStart: timeSubmit(timeStartExcel),
					timeEnd: timeSubmit(timeEndExcel, true),
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	const handleExportExcel = () => {
		return exportExcel.mutate();
	};

	const contentToPrint = useRef<HTMLDivElement>(null);

	const handlePrint = useReactToPrint({
		content: () => contentToPrint.current,
		documentTitle: 'Debt Information',
		onBeforePrint: () => console.log('before printing...'),
		onAfterPrint: () => console.log('after printing...'),
		removeAfterPrint: true,
	});

	const columns = [
		{title: 'Mã NCC', render: (data: any) => <>{data?.code}</>},
		{title: 'Tên NCC', render: (data: any) => <>{data?.name}</>},
		{title: 'Số xưởng', render: (data: any) => <>{data?.countCustomer}</>},
		{title: 'Công nợ tạm tính (VNĐ)', render: (data: any) => <>{convertCoin(data?.debtDemo)}</>},
		{title: 'Công nợ chuẩn (VNĐ)', render: (data: any) => <>{convertCoin(data?.debtReal)}</>},
		{title: 'Tổng công nợ (VNĐ)', render: (data: any) => <>{convertCoin(data?.debtDemo + data?.debtReal)}</>},
		{title: 'Thuế đã trả (VNĐ)', render: (data: any) => <>{convertCoin(data?.tax)}</>},
		{
			title: 'Thanh toán gần nhất',
			render: (data: any) => (
				<>
					{data?.lastTransaction ? (
						<p style={{display: 'flex', flexDirection: 'column', gap: 2}}>
							<span>
								<Moment date={data?.lastTransaction?.created} format='DD/MM/YYYY' />
							</span>
							<MoneyDebt value={data?.lastTransaction?.totalAmount} />
						</p>
					) : (
						'---'
					)}
				</>
			),
		},
	];

	const sendMail = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Gửi email thành công!',
				http: debtBillServices.sendMail({
					timeStart: timeSubmit(timeStart),
					timeEnd: timeSubmit(timeEnd, true),
					partnerUuid: listSelectPartnerDebt,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseSendMail();
			}
		},
	});

	const handleSendMail = () => {
		const dateStart = new Date(timeStart!);
		const dateEnd = new Date(timeSubmit(timeEnd!)!);

		if (dateStart > dateEnd) {
			return toastWarn({msg: 'Bộ lọc không hợp lệ!'});
		}

		return sendMail.mutate();
	};

	const handleCloseSendMail = () => {
		setOpenSendMail(false);
		setTimeStart(null);
		setTimeEnd(null);
	};

	///
	const handleKeyDown = (
		e: React.KeyboardEvent,
		row: number,
		col: number,
		uuid: string,
		budgetBank: any,
		budgetCash: any,
		event: any
	) => {
		if (e.key === 'ArrowDown') {
			if (inputRefs.current[row + 1] && inputRefs.current[row + 1][col]) {
				inputRefs.current[row + 1][col]?.focus();
			}
		} else if (e.key === 'ArrowUp') {
			if (inputRefs.current[row - 1] && inputRefs.current[row - 1][col]) {
				inputRefs.current[row - 1][col]?.focus();
			}
		} else if (e.key === 'ArrowRight') {
			if (inputRefs.current[row][col + 1]) {
				inputRefs.current[row][col + 1]?.focus();
			}
		} else if (e.key === 'ArrowLeft') {
			if (inputRefs.current[row][col - 1]) {
				inputRefs.current[row][col - 1]?.focus();
			}
		} else if (e.key === 'Tab') {
			e.preventDefault();

			if (e.shiftKey) {
				if (inputRefs.current[row][col - 1]) {
					inputRefs.current[row][col - 1]?.focus();
				}
			} else {
				if (inputRefs.current[row][col + 1]) {
					inputRefs.current[row][col + 1]?.focus();
				} else {
					if (inputRefs.current[row + 1] && inputRefs.current[row + 1][0]) {
						inputRefs.current[row + 1][0]?.focus();
					}
				}
			}
		}
		if (event.key === 'Enter' || event.keyCode === 13) {
			return funcUpdateBudget.mutate({
				uuid: uuid,
				budgetBank: price(budgetBank),
				budgetCash: price(budgetCash),
			});
		}
	};

	const handleBudgetCashChange = (uuid: string, value: any) => {
		setPartnerDebt((prev) => {
			return prev.map((v) => {
				if (v.uuid === uuid) {
					return {
						...v,
						budgetCash: !Number(price(value)) ? 0 : convertCoin(Number(price(value))),
					};
				} else {
					return v;
				}
			});
		});
	};

	const handleBudgetBankChange = (uuid: string, value: any) => {
		setPartnerDebt((prev) => {
			return prev.map((v) => {
				if (v.uuid === uuid) {
					return {
						...v,
						budgetBank: !Number(price(value)) ? 0 : convertCoin(Number(price(value))),
					};
				} else {
					return v;
				}
			});
		});
	};

	const handleCloseExportExcel = () => {
		setOpenExportExcel(false);
		setTimeStartExcel(null);
		setTimeEndExcel(null);
	};

	const handleExportExcelTotal = () => {
		const dateStart = new Date(timeStartExcel!);
		const dateEnd = new Date(timeSubmit(timeEndExcel!)!);

		if (dateStart > dateEnd) {
			return toastWarn({msg: 'Bộ lọc không hợp lệ!'});
		}

		return exportExcelTotal.mutate();
	};

	return (
		<Fragment>
			<Loading loading={funcUpdateBudget?.isLoading || exportExcel?.isLoading || sendMail?.isLoading} />
			<FlexLayout>
				<div className={styles.header}>
					<div className={styles.main_search}>
						{partnerDebt?.some((x) => x.isChecked !== false) && (
							<div style={{height: 40}}>
								<Button
									className={styles.btn}
									rounded_2
									maxHeight
									p_4_12
									onClick={() => {
										setListSelectPartnerDebt(
											partnerDebt
												?.filter((v) => v.isChecked !== false && v?.isTotal == false)
												?.map((x: any) => x.uuid)
										);
										setOpenSendMail(true);
									}}
									// onClick={() => setOpenSendMail(true)}
								>
									Gửi Email
								</Button>
							</div>
						)}

						<div className={styles.search}>
							<Search keyName='_keyword' placeholder='Tìm kiếm công ty' />
						</div>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Người quản lý'
								query='_userUuid'
								listFilter={listUser?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.fullName,
								}))}
							/>
						</div>
						<div className={styles.filter}>
							<SelectFilterMany
								selectedIds={listCompanyUuid}
								setSelectedIds={setListCompanyUuid}
								listData={listCompany?.data?.map((v: any) => ({
									uuid: v?.uuid,
									name: v?.name,
								}))}
								name='Kv cảng xuất khẩu'
							/>
						</div>
					</div>

					<div className={styles.btn}>
						<Button rounded_2 w_fit p_8_16 green bold onClick={handleExportExcel}>
							Xuất excel
						</Button>
						{/* <Button rounded_2 w_fit p_8_16 green bold onClick={handlePrint}>
							In file
						</Button> */}

						<Button rounded_2 w_fit p_8_16 orange bold onClick={() => setOpenExportExcel(true)}>
							Xuất tổng hợp mua hàng
						</Button>
					</div>
				</div>
				{/* <div className={clsx('mt')}>
					<div className={styles.parameter}>
						<div>
							TỔNG LƯỢNG HÀNG TƯƠI:
							<span style={{color: '#2D74FF', marginLeft: 4}}>{convertWeight(0) || 0} </span>(Tấn)
						</div>
					</div>
				</div> */}

				<FullColumnFlex>
					<DataWrapper
						data={partnerDebt || []}
						loading={listPartnerDebt.isLoading}
						noti={<Noti disableButton={true} title='Dữ liệu trống!' des='Danh sách công nợ công ty trống!' />}
					>
						<div style={{display: 'none'}}>
							<ComponentToPrint ref={contentToPrint} data={listPartnerDebt?.data?.items} columns={columns} />
						</div>
						<Table
							fixedHeader={true}
							data={partnerDebt || []}
							onSetData={setPartnerDebt}
							isDisableCheckBox={(data) => !data?.email}
							column={[
								{
									title: 'Mã công ty',
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt) => <>{data?.code}</>,
								},
								{
									title: 'Tên công ty',
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									checkBox: true,
									fixedLeft: true,
									render: (data: IPartnerDebt) => (
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
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									totalMoney: 100,
									render: (data: IPartnerDebt) => (
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
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt) => (
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
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt) => (
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
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt) => (
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
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt) => (
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
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt) => (
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
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt) => (
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
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt) => (
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
								// 	isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
								// 	render: (data: IPartnerDebt) => (
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
								// 	isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
								// 	render: (data: IPartnerDebt) => (
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
								// 	isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
								// 	render: (data: IPartnerDebt) => (
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
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt, index: number) => (
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
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt, rowIndex: any) =>
										data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.totalBudgetBank)}</p>
										) : (
											<div className={styles.valueBudget}>
												<input
													className={styles.input}
													type='text'
													value={data?.budgetBank}
													ref={(el) => {
														if (!inputRefs.current[rowIndex]) {
															inputRefs.current[rowIndex] = [];
														}
														inputRefs.current[rowIndex][0] = el;
													}}
													onChange={(e) => handleBudgetBankChange(data.uuid, e.target.value)}
													onKeyDown={(e) =>
														handleKeyDown(e, rowIndex, 0, data.uuid, data?.budgetBank, data?.budgetCash, e)
													}
												/>
												<div className={styles.iconEdit}>
													<Edit2 size={16} />
												</div>
											</div>
										),
								},
								{
									title: (
										<span className={styles.unit}>
											Tiền mặt <br />
											(VNĐ)
										</span>
									),
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt, rowIndex: any) =>
										data?.isTotal ? (
											<p className={styles.totalText}>{convertCoin(data?.totalBudgetCash)}</p>
										) : (
											<div className={styles.valueBudget}>
												<input
													className={styles.input}
													type='text'
													value={data?.budgetCash}
													ref={(el) => {
														if (!inputRefs.current[rowIndex]) {
															inputRefs.current[rowIndex] = [];
														}
														inputRefs.current[rowIndex][1] = el;
													}}
													onChange={(e) => handleBudgetCashChange(data.uuid, e.target.value)}
													onKeyDown={(e) =>
														handleKeyDown(e, rowIndex, 1, data.uuid, data?.budgetBank, data?.budgetCash, e)
													}
												/>
												<div className={styles.iconEdit}>
													<Edit2 size={16} />
												</div>
											</div>
										),
								},

								// {
								// 	title: (
								// 		<span className={styles.unit}>
								// 			Căn tiền chuyển
								// 			<br />
								// 			(VNĐ)
								// 		</span>
								// 	),
								// 	render: (data: IPartnerDebt, index: number) => (
								// 		<div className={styles.valueBudget}>
								// 			{/* <input
								// 				ref={(el) => (inputRefs.current[index] = el)}
								// 				tabIndex={index + 1}
								// 				className={styles.input}
								// 				type='text'
								// 				value={data?.budget}
								// 				onChange={(e) => handleBudgetChange(data.uuid, e.target.value)}
								// 				onKeyDown={(e) => handleKeyEnter(data.uuid, data?.budget, e, index)}
								// 			/>
								// 			<div className={styles.iconEdit}>
								// 				<Edit2 size={16} />
								// 			</div> */}
								// 		</div>
								// 	),
								// },
								{
									title: 'Thanh toán gần nhất',
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									render: (data: IPartnerDebt) =>
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
								// {
								// 	title: 'Số NCC',
								// 	isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
								// 	render: (data: IPartnerDebt) => <>{data?.isTotal ? <p></p> : data?.countCustomer}</>,
								// },
								{
									title: 'Tác vụ',
									selectRow: true,
									isTitle: (data: IPartnerDebt) => (data?.isTotal ? true : false),
									fixedRight: true,
									render: (data: IPartnerDebt) => (
										<>
											{data?.isTotal ? (
												<p></p>
											) : (
												<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
													<IconCustom
														edit
														icon={<DollarCircle fontSize={20} fontWeight={600} />}
														tooltip='Thanh toán công nợ'
														color='#2CAE39'
														// href={`/cong-no-ncc?_uuid=${data?.uuid}&_type=thanh-toan-cong-no`}
														onClick={() => {
															router.replace(
																{
																	pathname: router.pathname,
																	query: {
																		...router.query,
																		_type: 'thanh-toan-cong-no',
																		_uuid: data?.uuid,
																	},
																},
																undefined,
																{shallow: true, scroll: false}
															);
														}}
													/>
													<IconCustom
														edit
														icon={<MoneyRecive fontSize={20} fontWeight={600} />}
														tooltip='Thu hồi công nợ'
														color='#F27A37'
														// href={`/cong-no-ncc?_uuid=${data?.uuid}&_type=thu-hoi-cong-no`}
														onClick={() => {
															router.replace(
																{
																	pathname: router.pathname,
																	query: {
																		...router.query,
																		_type: 'thu-hoi-cong-no',
																		_uuid: data?.uuid,
																	},
																},
																undefined,
																{shallow: true, scroll: false}
															);
														}}
													/>
													<IconCustom
														edit
														icon={<DiscountShape fontSize={20} fontWeight={600} />}
														tooltip='Thanh toán thuế'
														color='#FFBB55'
														// href={`/cong-no-ncc?_uuid=${data?.uuid}&_type=thanh-toan-thue`}
														onClick={() => {
															router.replace(
																{
																	pathname: router.pathname,
																	query: {
																		...router.query,
																		_type: 'thanh-toan-thue',
																		_uuid: data?.uuid,
																	},
																},
																undefined,
																{shallow: true, scroll: false}
															);
														}}
													/>
													<IconCustom
														edit
														icon={<Edit2 fontSize={20} fontWeight={600} />}
														tooltip='Chỉnh sửa'
														color='#777E90'
														href={`/cong-no-ncc/chinh-sua/${data?.uuid}`}
													/>
													<IconCustom
														edit
														icon={<Personalcard fontSize={20} fontWeight={600} />}
														tooltip='Thông tin chi tiết'
														color='#777E90'
														href={`/cong-no-ncc/${data?.uuid}`}
													/>
												</div>
											)}
										</>
									),
								},
							]}
						/>
					</DataWrapper>
					{/* {!listPartnerDebt.isFetching && ( */}
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 200}
						total={listPartnerDebt?.data?.pagination?.totalCount}
						dependencies={[_pageSize, _keyword, _userUuid, listCompanyUuid]}
					/>
					{/* )} */}
				</FullColumnFlex>
			</FlexLayout>

			<Popup open={!!_uuid && _type == 'thanh-toan-cong-no'} onClose={handleClosePopup}>
				<FormPaymentDebt onClose={handleClosePopup} />
			</Popup>

			<Popup open={!!_uuid && _type == 'thu-hoi-cong-no'} onClose={handleClosePopup}>
				<FormRecoverDebt onClose={handleClosePopup} />
			</Popup>

			<Popup open={!!_uuid && _type == 'thanh-toan-thue'} onClose={handleClosePopup}>
				<FormPaymentTax onClose={handleClosePopup} />
			</Popup>

			<Popup open={openSendMail} onClose={handleCloseSendMail}>
				<div className={styles.main_export}>
					<h4 className={styles.title_export}>Gửi email</h4>
					<p className={styles.des_export}>Chọn khoảng thời gian lấy dữ liệu</p>

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
					<div className={styles.control_export}>
						<div>
							<Button p_10_24 rounded_2 grey_outline onClick={handleCloseSendMail}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<Button disable={!timeStart || !timeEnd} p_10_24 rounded_2 primary onClick={handleSendMail}>
								Xác nhận
							</Button>
						</div>
					</div>

					<div className={styles.icon_close_export} onClick={handleCloseSendMail}>
						<IoClose size={24} color='#23262F' />
					</div>
				</div>
			</Popup>

			<Popup open={openExportExcel} onClose={handleCloseExportExcel}>
				<div className={styles.main_export}>
					<h4 className={styles.title_export}>Xuất tổng hợp mua hàng</h4>
					<p className={styles.des_export}>Chọn khoảng thời gian muốn xuất tổng hợp mua hàng</p>

					<div className={styles.time_export}>
						<DatePicker
							label={
								<span>
									Từ ngày <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Chọn ngày'
							value={timeStartExcel}
							onSetValue={setTimeStartExcel}
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
							value={timeEndExcel}
							onSetValue={setTimeEndExcel}
							name='setTimeEnd'
							onClean={true}
							icon={true}
						/>
					</div>

					<div className={styles.control_export}>
						<div>
							<Button p_10_24 rounded_2 grey_outline onClick={handleCloseExportExcel}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<Button disable={!timeStartExcel || !timeEndExcel} p_10_24 rounded_2 primary onClick={handleExportExcelTotal}>
								Xác nhận
							</Button>
						</div>
					</div>

					<div className={styles.icon_close_export} onClick={handleCloseExportExcel}>
						<IoClose size={24} color='#23262F' />
					</div>
				</div>
			</Popup>
		</Fragment>
	);
};

export default PageDebtCompany;
