import React, {useState} from 'react';
import {IDetailPartner, PropsPageDetailPartner} from './interfaces';
import styles from './PageDetailPartner.module.scss';
import {useMutation, useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import {httpRequest} from '~/services';
import partnerServices from '~/services/partnerServices';
import Link from 'next/link';
import {IoArrowBackOutline, IoClose} from 'react-icons/io5';
import clsx from 'clsx';
import GridColumn from '~/components/layouts/GridColumn';
import TagStatus from '~/components/common/TagStatus';
import Button from '~/components/common/Button';
import {LuPencil} from 'react-icons/lu';
import ItemDashboard from '../../dashboard/ItemDashboard';
import {getTextAddress, timeSubmit} from '~/common/funcs/optionConvert';
import TabNavLink from '~/components/common/TabNavLink';
import TableImport from '../TableImport';
import TablePay from '../TablePay';
import TableDebt from '../TableDebt';
import debtBillServices from '~/services/debtBillServices';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import DatePicker from '~/components/common/DatePicker';
import {toastWarn} from '~/common/funcs/toast';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import Select, {Option} from '~/components/common/Select';
import companyServices from '~/services/companyServices';
import dashbroadServices from '~/services/dashbroadServices';

function PageDetailPartner({}: PropsPageDetailPartner) {
	const router = useRouter();

	const {_uuid, _type} = router.query;

	const [openExportExcel, setOpenExportExcel] = useState<boolean>(false);
	const [openSendMail, setOpenSendMail] = useState<boolean>(false);
	const [openRefreshMonthly, setOpenFreshMonthly] = useState<boolean>(false);
	const [timeStart, setTimeStart] = useState<Date | null>(null);
	const [timeEnd, setTimeEnd] = useState<Date | null>(null);
	const [timeStartRefresh, setTimeStartRefresh] = useState<Date | null>(null);
	const [timeEndRefresh, setTimeEndRefresh] = useState<Date | null>(null);
	const [companyUuid, setCompanyUuid] = useState<string | null>(null);

	const {data: detailPartner, isLoading} = useQuery<IDetailPartner>([QUERY_KEY.chi_tiet_doi_tac, _uuid], {
		queryFn: () =>
			httpRequest({
				http: partnerServices.detailPartner({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
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

	const exportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: debtBillServices.exportExcel({
					partnerUuid: _uuid as string,
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

	const sendMail = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Gửi email thành công!',
				http: debtBillServices.sendMail({
					timeStart: timeSubmit(timeStart),
					timeEnd: timeSubmit(timeEnd, true),
					partnerUuid: [_uuid as string],
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseSendMail();
			}
		},
	});
	const refreshMonthlyDebt = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Tính toán lại công nợ thành công!',
				http: dashbroadServices.refreshMonthlyDebt({
					timeStart: timeSubmit(timeStartRefresh),
					timeEnd: timeSubmit(timeEndRefresh, true),
					partnerUuid: [_uuid as string],
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseRefreshMonthlyDebt();
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

	const handleRefreshMonthlyDebt = () => {
		const dateStart = new Date(timeStart!);
		const dateEnd = new Date(timeSubmit(timeEnd!)!);

		if (dateStart > dateEnd) {
			return toastWarn({msg: 'Bộ lọc không hợp lệ!'});
		}

		return refreshMonthlyDebt.mutate();
	};

	const handleOpenFreshMonthly = () => {
		setOpenFreshMonthly(true);
		setTimeEndRefresh(new Date());
	};

	const handleCloseSendMail = () => {
		setOpenSendMail(false);
		setTimeStart(null);
		setTimeEnd(null);
	};

	const handleCloseRefreshMonthlyDebt = () => {
		setOpenFreshMonthly(false);
		setTimeStartRefresh(null);
		setTimeEndRefresh(null);
	};

	return (
		<FlexLayout isPage={true}>
			<Loading loading={exportExcel.isLoading || sendMail.isLoading} />
			<div className={styles.header}>
				<Link
					href='#'
					onClick={(e) => {
						e.preventDefault();
						window.history.back();
					}}
					className={styles.header_title}
				>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Chi tiết công ty {detailPartner?.code}</p>
				</Link>

				<div className={styles.list_btn}>
					<Button
						rounded_2
						w_fit
						light_outline
						p_8_16
						bold
						href={`/cong-no-ncc/chinh-sua/${detailPartner?.uuid}`}
						icon={<LuPencil color='#23262F' fontSize={16} fontWeight={600} />}
					>
						Chỉnh sửa
					</Button>
					<Button rounded_2 w_fit orange p_8_16 bold onClick={handleOpenFreshMonthly}>
						Tính lại công nợ
					</Button>

					<Button rounded_2 w_fit p_8_16 green bold onClick={() => setOpenExportExcel(true)}>
						Xuất báo cáo gửi KH
					</Button>
					<Button className={styles.btn} rounded_2 maxHeight p_8_16 onClick={() => setOpenSendMail(true)}>
						Gửi Email
					</Button>
				</div>
			</div>
			<div className={clsx('mt')}>
				<TabNavLink
					listHref={[
						{
							title: 'Tổng quan',
							pathname: router.pathname,
							query: null,
						},
						{
							title: 'Lịch sử nhập hàng',
							pathname: router.pathname,
							query: 'history-import',
						},
						{
							title: 'Lịch sử thanh toán',
							pathname: router.pathname,
							query: 'history-pay',
						},
						{
							title: 'Lịch sử công nợ',
							pathname: router.pathname,
							query: 'history-debt',
						},
					]}
					query='_type'
					listKeyRemove={[
						'_typeDate',
						'_dateFrom',
						'_dateTo',
						'_page',
						'_pageSize',
						'_q',
						'_k',
						'_companiUuid',
						'_date',
						'_typeTranfer',
					]}
				/>
			</div>
			<FullColumnFlex>
				{!_type && (
					<>
						<div className={clsx('mt')}>
							<div>
								<ItemDashboard
									isLoading={isLoading}
									color='#FB923C'
									text='Công nợ phải trả'
									value={detailPartner?.debtTotal!}
									unit='VNĐ'
								/>
							</div>
							<div className={clsx('mt')}>
								<GridColumn col_5>
									<ItemDashboard
										isLoading={isLoading}
										color='#3772FF'
										text='Dư đầu kỳ'
										value={detailPartner?.debtBefore!}
										unit='VNĐ'
									/>
									<ItemDashboard
										isLoading={isLoading}
										color='#3772FF'
										text='Tiền hàng trong tháng'
										value={detailPartner?.money!}
										unit='VNĐ'
									/>
									<ItemDashboard
										isLoading={isLoading}
										color='#3772FF'
										text='VAT'
										value={detailPartner?.tax!}
										unit='VNĐ'
									/>
									<ItemDashboard
										isLoading={isLoading}
										color='#3772FF'
										text='Nộp trả lại'
										value={detailPartner?.moneyReceived!}
										unit='VNĐ'
									/>
									<ItemDashboard
										isLoading={isLoading}
										color='#3772FF'
										text='Đã thanh toán'
										value={detailPartner?.moneyPay!}
										unit='VNĐ'
									/>
								</GridColumn>
							</div>

							<div className={clsx('mt')}>
								<GridColumn col_3>
									<ItemDashboard
										isLoading={isLoading}
										color='#3772FF'
										text='Nhà cung cấp'
										value={detailPartner?.countCustomer!}
									/>
									<ItemDashboard
										isLoading={isLoading}
										color='#3772FF'
										text='Phiếu chưa KCS'
										value={detailPartner?.totalBillDemo!}
									/>
									<ItemDashboard
										isLoading={isLoading}
										color='#3772FF'
										text='Phiếu đã KCS'
										value={detailPartner?.totalBillKCS!}
									/>
									{/* <ItemDashboard
										isLoading={isLoading}
										color='#3772FF'
										text='Số lần thu'
										value={detailPartner?.totalTransactionIn!}
									/>
									<ItemDashboard
										isLoading={isLoading}
										color='#3772FF'
										text='Số lần chi'
										value={detailPartner?.totalTransactionOut!}
									/> */}
								</GridColumn>
							</div>
						</div>
						<div className={clsx('mt')}>
							<table className={styles.container}>
								<colgroup>
									<col style={{width: '50%'}} />
									<col style={{width: '50%'}} />
								</colgroup>
								<tr>
									<td>
										<span style={{marginRight: 6}}>Mã công ty:</span>
										<span style={{color: 'rgb(55, 114, 255)'}}>{detailPartner?.code || '---'}</span>
									</td>
									<td>
										<span style={{marginRight: 6}}>Người đại diện:</span> {detailPartner?.director || '---'}
									</td>
								</tr>
								<tr>
									<td>
										<span style={{marginRight: 6}}>Tên công ty:</span>
										<span style={{color: 'rgb(55, 114, 255)'}}>{detailPartner?.name || '---'}</span>
									</td>
									<td>
										<span style={{marginRight: 6}}>Khu vực cảng xuất khẩu:</span>
										{detailPartner?.companyUu?.name || '---'}
									</td>
								</tr>
								<tr>
									<td>
										<span style={{marginRight: 6}}>Mã số thuế:</span>
										{detailPartner?.taxCode || '---'}
									</td>
									<td>
										<span style={{marginRight: 6}}>Địa chỉ:</span>
										{getTextAddress(detailPartner?.detailAddress, detailPartner?.address)}
									</td>
								</tr>
								<tr>
									<td>
										<span style={{marginRight: 6}}>Số điện thoại:</span>
										{detailPartner?.phoneNumber || '---'}
									</td>
									<td>
										<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
											<span style={{marginRight: 6}}>Trạng thái:</span>
											<span>
												<TagStatus status={detailPartner?.status!} />
											</span>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<span style={{marginRight: 6}}>Ngân hàng:</span>
										{detailPartner?.bankName || '---'}
									</td>
									<td rowSpan={4} className={styles.description}>
										<span style={{marginRight: 6}}>Mô tả:</span>
										{detailPartner?.description || '---'}
									</td>
								</tr>
								<tr>
									<td>
										<span style={{marginRight: 6}}>Số tài khoản:</span>
										{detailPartner?.bankAccount || '---'}
									</td>
								</tr>
								<tr>
									<td>
										<span style={{marginRight: 6}}>Email:</span>
										{detailPartner?.email || '---'}
									</td>
								</tr>
							</table>
						</div>
					</>
				)}
				{_type == 'history-import' && <TableImport />}
				{_type == 'history-pay' && <TablePay />}
				{_type == 'history-debt' && <TableDebt />}
			</FullColumnFlex>

			<Popup open={openExportExcel} onClose={handleCloseExportExcel}>
				<div className={styles.main_export}>
					<h4 className={styles.title_export}>Xuất báo cáo gửi khách hàng</h4>
					<p className={styles.des_export}>Chọn khoảng thời gian muốn xuất báo cáo gửi khách hàng</p>

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
			<Popup open={openRefreshMonthly} onClose={handleCloseRefreshMonthlyDebt}>
				<div className={styles.main_export}>
					<h4 className={styles.title_export}>Tính lại công nợ</h4>
					<p className={styles.des_export}>Chọn khoảng thời gian bắt đầu</p>

					<div className={styles.time_export}>
						<DatePicker
							label={
								<span>
									Từ ngày <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Chọn ngày'
							value={timeStartRefresh}
							onSetValue={setTimeStartRefresh}
							name='timeStartRefresh'
							onClean={true}
							icon={true}
						/>
						<DatePicker
							readOnly={true}
							label={
								<span>
									Đến ngày <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Chọn ngày'
							value={timeEndRefresh}
							onSetValue={setTimeEndRefresh}
							name='setTimeEndRefresh'
							onClean={true}
							icon={true}
						/>
					</div>

					<div className={styles.control_export}>
						<div>
							<Button p_10_24 rounded_2 grey_outline onClick={handleCloseRefreshMonthlyDebt}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<Button
								disable={!timeStartRefresh || !timeEndRefresh}
								p_10_24
								rounded_2
								primary
								onClick={handleRefreshMonthlyDebt}
							>
								Xác nhận
							</Button>
						</div>
					</div>

					<div className={styles.icon_close_export} onClick={handleCloseRefreshMonthlyDebt}>
						<IoClose size={24} color='#23262F' />
					</div>
				</div>
			</Popup>
		</FlexLayout>
	);
}

export default PageDetailPartner;
