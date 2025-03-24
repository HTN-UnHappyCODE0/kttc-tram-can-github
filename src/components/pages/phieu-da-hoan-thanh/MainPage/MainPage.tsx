import React, {useEffect, useState} from 'react';

import styles from './MainPage.module.scss';
import {PropsMainPage} from './interfaces';
import {useRouter} from 'next/router';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_NAME,
	STATE_BILL,
	STATUS_BILL,
	TYPE_BATCH,
	TYPE_CHECK_DAY_BILL,
	TYPE_DATE,
	TYPE_PARTNER,
	TYPE_PRODUCT,
	TYPE_SCALES,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import partnerServices from '~/services/partnerServices';
import regencyServices from '~/services/regencyServices';
import userServices from '~/services/userServices';
import debtBillServices from '~/services/debtBillServices';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import IconCustom from '~/components/common/IconCustom';
import {Eye, TickCircle} from 'iconsax-react';
import {IDebtBill} from '../../phieu-chua-hoan-thanh/MainPageAll/interfaces';
import {convertCoin} from '~/common/funcs/convertCoin';
import {convertWeight, formatDrynessAvg} from '~/common/funcs/optionConvert';
import Table from '~/components/common/Table';
import Moment from 'react-moment';
import Noti from '~/components/common/DataWrapper/components/Noti';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import companyServices from '~/services/companyServices';
import clsx from 'clsx';
import scalesStationServices from '~/services/scalesStationServices';
import wareServices from '~/services/wareServices';
import batchBillServices from '~/services/batchBillServices';
import Popup from '~/components/common/Popup';
import FormAccessSpecExcel from '../../phieu-chua-hoan-thanh/FormAccessSpecExcel';
import Button from '~/components/common/Button';
import Loading from '~/components/common/Loading';
import PopupUpdateDocumentId from '../PopupUpdateDocumentId';
import SelectFilterState from '~/components/common/SelectFilterState';
import SelectFilterMany from '~/components/common/SelectFilterMany';

function MainPage({}: PropsMainPage) {
	const router = useRouter();

	const [openExportExcel, setOpenExportExcel] = useState<boolean>(false);
	const [listDebtBill, setListDebtBill] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [listSelectDebtBill, setListSelectDebtBill] = useState<any[]>([]);
	const [uuidProductType, setUuidProductType] = useState<string>('');
	const [uuidSpecification, setUuidSpecification] = useState<string>('');
	const [listCompanyUuid, setListCompanyUuid] = useState<any[]>([]);

	const {_page, _pageSize, _keyword, _partnerUuid, _userUuid, _dateFrom, _dateTo, _companyUuid, _scalesStationUuid} = router.query;

	const listPartner = useQuery([QUERY_KEY.dropdown_nha_cung_cap, _companyUuid], {
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
					companyUuid: (_companyUuid as string) || '',
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

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					type: [TYPE_PRODUCT.CONG_TY],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listSpecification = useQuery([QUERY_KEY.dropdown_quy_cach, uuidProductType], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
					productTypeUuid: uuidProductType,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listScalesStation = useQuery([QUERY_KEY.table_tram_can, _companyUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: scalesStationServices.listScalesStation({
					page: 1,
					pageSize: 50,
					keyword: '',
					companyUuid: (_companyUuid as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	useEffect(() => {
		if (_companyUuid) {
			const updatedQuery = {
				...router.query,
				_scalesStationUuid: '',
				_partnerUuid: '',
			};

			router.replace({
				pathname: router.pathname,
				query: updatedQuery,
			});
		}
	}, [_companyUuid]);

	const getlistDebtBill = useQuery(
		[
			QUERY_KEY.table_cong_no_phieu_hoan_thanh,
			_page,
			_pageSize,
			_keyword,
			_partnerUuid,
			_userUuid,
			_dateFrom,
			_dateTo,
			_companyUuid,
			uuidProductType,
			uuidSpecification,
			_scalesStationUuid,
			listCompanyUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: debtBillServices.getListDebtBill({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isDescending: CONFIG_DESCENDING.IS_DESCENDING,
						status: [STATUS_BILL.CHOT_KE_TOAN],
						partnerUuid: (_partnerUuid as string) || '',
						userUuid: (_userUuid as string) || '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						companyUuid: '',
						isBatch: [TYPE_BATCH.CAN_LO, TYPE_BATCH.CAN_LE, TYPE_BATCH.KHONG_CAN, TYPE_BATCH.IMPORT_EXCEL],
						specificationsUuid: uuidSpecification,
						productTypeUuid: uuidProductType,
						scalesStationUuid: (_scalesStationUuid as string) || '',
						listCompanyUuid: listCompanyUuid,
						typeProduct: TYPE_PRODUCT.CONG_TY,
					}),
				}),
			onSuccess(data) {
				if (data) {
					setListDebtBill(
						data?.items?.map((v: any, index: number) => ({
							...v,
							index: index,
							isChecked: false,
						}))
					);
					setTotal(data?.pagination?.totalCount);
				}
			},
			select(data) {
				if (data) {
					return data;
				}
			},
		}
	);

	const exportExcel = useMutation({
		mutationFn: (isHaveSpec: number) => {
			return httpRequest({
				http: batchBillServices.exportExcel({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 200,
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.IS_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
					customerUuid: '',
					listCustomerUuid: [],
					isBatch: null,
					isCreateBatch: null,
					productTypeUuid: uuidProductType,
					specificationsUuid: uuidSpecification,
					status: [STATUS_BILL.CHOT_KE_TOAN],
					state: [STATE_BILL.KTK_CHECKED, STATE_BILL.END],
					timeStart: _dateFrom ? (_dateFrom as string) : null,
					timeEnd: _dateTo ? (_dateTo as string) : null,
					warehouseUuid: '',
					qualityUuid: '',
					transportType: null,
					typeCheckDay: TYPE_CHECK_DAY_BILL.THOI_GIAN_KTK_DUYET,
					scalesStationUuid: (_scalesStationUuid as string) || '',
					documentId: '',
					shipUuid: '',
					storageUuid: '',
					isExportSpec: isHaveSpec,
					truckUuid: [],
					companyUuid: '',
					partnerUuid: (_partnerUuid as string) || '',
					listCompanyUuid: listCompanyUuid,
					typeProduct: TYPE_PRODUCT.CONG_TY,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
				setOpenExportExcel(false);
			}
		},
	});

	const handleExportExcel = (isHaveSpec: number) => {
		return exportExcel.mutate(isHaveSpec);
	};

	useEffect(() => {
		if (uuidProductType) {
			setUuidSpecification('');
		}
	}, [uuidProductType]);

	return (
		<FlexLayout>
			<Loading loading={exportExcel.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					{listDebtBill?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								danger
								p_4_12
								onClick={() => {
									setListSelectDebtBill(listDebtBill?.filter((v) => v.isChecked !== false)?.map((x: any) => x.uuid));
								}}
							>
								Cập nhật chứng từ
							</Button>
						</div>
					)}
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã lô hàng' />
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

					<FilterCustom
						isSearch
						name='Trạm cân'
						query='_scalesStationUuid'
						listFilter={listScalesStation?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>

					<div className={styles.filter}>
						<SelectFilterState
							uuid={uuidProductType}
							setUuid={setUuidProductType}
							listData={listProductType?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Loại hàng'
						/>
					</div>
					<div className={styles.filter}>
						<SelectFilterState
							uuid={uuidSpecification}
							setUuid={setUuidSpecification}
							listData={listSpecification?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Quy cách'
						/>
					</div>

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.YESTERDAY} />
					</div>
				</div>
				<div className={styles.btn}>
					<Button
						rounded_2
						w_fit
						p_8_16
						green
						bold
						onClick={() => {
							setOpenExportExcel(true);
						}}
					>
						Xuất excel
					</Button>
				</div>
			</div>

			<div className={clsx('mt', 'mb')}>
				<div className={styles.parameter}>
					<div>
						TỔNG LÔ HÀNG: <span style={{color: '#2D74FF', marginLeft: 4}}>{getlistDebtBill?.data?.pagination?.totalCount}</span>
					</div>
					<div>
						TỔNG CÔNG NỢ TẠM TÍNH: <span style={{marginLeft: 4}}>{convertCoin(getlistDebtBill?.data?.debtDemo)} VNĐ</span>
					</div>
					<div>
						TỔNG CÔNG NỢ CHUẨN: <span style={{marginLeft: 4}}>{convertCoin(getlistDebtBill?.data?.debtReal)} VNĐ</span>
					</div>
					<div>
						TỔNG CÔNG NỢ:
						<span style={{marginLeft: 4}}>
							{convertCoin(Number(getlistDebtBill?.data?.debtDemo) + Number(getlistDebtBill?.data?.debtReal))} VNĐ
						</span>
					</div>
				</div>
			</div>

			<FullColumnFlex>
				<DataWrapper
					data={listDebtBill || []}
					loading={loading}
					noti={<Noti disableButton={true} title='Dữ liệu trống!' des='Danh sách phiếu phiếu trống!' />}
				>
					<Table
						fixedHeader={true}
						data={listDebtBill || []}
						onSetData={setListDebtBill}
						column={[
							{
								title: (
									<span className={styles.unit}>
										Mã phiếu
										<br />
										(tàu/xe)
									</span>
								),
								fixedLeft: true,
								checkBox: true,
								render: (data: IDebtBill) => (
									<span>
										<p style={{fontWeight: 600}}>{data?.code}</p>
										<p style={{fontWeight: 400, color: '#3772FF'}}>
											{data?.shipUu?.licensePalate || data?.truckUu?.licensePalate || '---'}
										</p>
									</span>
								),
							},
							{
								title: 'Thời gian cân',
								render: (data: IDebtBill) => (
									<>{data?.timeEnd ? <Moment date={data?.timeEnd} format='DD/MM/YYYY' /> : '---'}</>
								),
							},
							{
								title: <span className={styles.unit}>Khách hàng</span>,
								render: (data: IDebtBill) => <p className={styles.name}>{data?.fromUu?.partnerUu?.name || '---'}</p>,
							},

							{
								title: 'Quy cách',
								render: (data: IDebtBill) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: 'Loại hàng',
								render: (data: IDebtBill) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Cân lần 1
										<br />
										(Tấn)
									</span>
								),
								render: (data: IDebtBill) => <>{convertWeight(data?.totalWeight1 || 0)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Cân lần 2
										<br />
										(Tấn)
									</span>
								),
								render: (data: IDebtBill) => <>{convertWeight(data?.totalWeight2 || 0)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										TL tươi
										<br />
										(MT)
									</span>
								),
								render: (data: IDebtBill) => <>{convertWeight(data?.weightTotal || 0)}</>,
							},
							{
								title: 'Độ khô (%)',
								render: (data: IDebtBill) => <>{data?.drynessAvg?.toFixed(2) || 48}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										TL quy khô
										<br />
										(BDMT)
									</span>
								),
								render: (data: IDebtBill) => <>{convertWeight(data?.weightBdmt || 0)}</>,
							},
							{
								title: 'Giá tiền (VNĐ)',
								render: (data: IDebtBill) => <>{convertCoin(data?.priceTagUu?.amount || 0)}</>,
							},
							{
								title: 'Thành tiền (VNĐ)',
								render: (data: IDebtBill) => <>{convertCoin(data?.moneyTotal || 0)}</>,
							},

							{
								title: 'Xác nhận SL',
								render: (data: IDebtBill) => (
									<p style={{fontWeight: 600, color: ''}}>
										{data?.state == STATE_BILL.NOT_CHECK && <span style={{color: '#FF6838'}}>Chưa duyệt</span>}
										{data?.state == STATE_BILL.QLK_REJECTED && <span style={{color: '#6170E3'}}>QLK duyệt lại</span>}
										{data?.state == STATE_BILL.QLK_CHECKED && <span style={{color: '#6FD195'}}>QLK đã duyệt</span>}
										{data?.state == STATE_BILL.KTK_REJECTED && <span style={{color: '#FFAE4C'}}>KTK duyệt lại</span>}
										{data?.state == STATE_BILL.KTK_CHECKED && <span style={{color: '#3CC3DF'}}>KTK đã duyệt</span>}
										{data?.state == STATE_BILL.END && <span style={{color: '#D95656'}}>Kết thúc</span>}
									</p>
								),
							},
							{
								title: 'Trạng thái',
								render: (data: IDebtBill) => (
									<>
										{data?.status == STATUS_BILL.DANG_CAN && <span style={{color: '#9757D7'}}>Đang cân</span>}
										{data?.status == STATUS_BILL.TAM_DUNG && <span style={{color: '#353945'}}>Tạm dừng</span>}
										{data?.status == STATUS_BILL.DA_CAN_CHUA_KCS && (
											<span style={{color: '#D94212'}}>Đã cân chưa KCS</span>
										)}
										{data?.status == STATUS_BILL.DA_KCS && <span style={{color: '#3772FF'}}>Đã KCS</span>}
										{data?.status == STATUS_BILL.CHOT_KE_TOAN && <span style={{color: '#2CAE39'}}>Chốt kế toán</span>}
									</>
								),
							},
							{
								title: 'Cảng bốc dỡ',
								render: (data: IDebtBill) => <>{data?.port || '---'}</>,
							},
							{
								title: 'Tác vụ',
								selectRow: true,
								fixedRight: true,
								render: (data: IDebtBill) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={`/phieu-da-hoan-thanh/${data?.uuid}`}
										/>
										{data?.isUpdateDocumentId == 1 ? (
											<IconCustom
												edit
												icon={<TickCircle size={22} fontWeight={600} />}
												tooltip={`số hóa đơn: ${data?.documentId}`}
												color='#2CAE39'
											/>
										) : null}
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				{!loading && (
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 200}
						total={total}
						dependencies={[
							_pageSize,
							_keyword,
							_partnerUuid,
							_userUuid,
							_dateFrom,
							_dateTo,
							_companyUuid,
							_scalesStationUuid,
							listCompanyUuid,
						]}
					/>
				)}
			</FullColumnFlex>
			<Popup open={openExportExcel} onClose={() => setOpenExportExcel(false)}>
				<FormAccessSpecExcel
					onAccess={() => {
						handleExportExcel(1);
					}}
					onClose={() => {
						setOpenExportExcel(false);
					}}
					onDeny={() => {
						handleExportExcel(0);
					}}
				/>
			</Popup>

			<Popup
				open={listSelectDebtBill.length > 0}
				onClose={() => {
					setListSelectDebtBill([]);
				}}
			>
				<PopupUpdateDocumentId
					uuid={listSelectDebtBill}
					onClose={() => {
						setListSelectDebtBill([]);
					}}
				/>
			</Popup>
		</FlexLayout>
	);
}

export default MainPage;
