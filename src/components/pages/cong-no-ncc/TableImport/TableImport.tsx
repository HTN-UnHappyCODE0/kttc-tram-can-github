import React, {useEffect, useState} from 'react';

import {PropsTableImport} from './interfaces';
import styles from './TableImport.module.scss';
import Search from '~/components/common/Search';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import {useRouter} from 'next/router';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_BILL,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import debtBillServices from '~/services/debtBillServices';
import Pagination from '~/components/common/Pagination';
import {IDebtBill} from '../../phieu-chua-hoan-thanh/MainPageAll/interfaces';
import {convertWeight, formatDrynessAvg} from '~/common/funcs/optionConvert';
import {convertCoin} from '~/common/funcs/convertCoin';
import Table from '~/components/common/Table';
import Moment from 'react-moment';
import Noti from '~/components/common/DataWrapper/components/Noti';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import FilterCustom from '~/components/common/FilterCustom';
import companyServices from '~/services/companyServices';
import wareServices from '~/services/wareServices';
import SelectFilterState from '~/components/common/SelectFilterState';
import SelectFilterMany from '~/components/common/SelectFilterMany';

function TableImport({}: PropsTableImport) {
	const router = useRouter();

	const {_page, _pageSize, _q, _dateFrom, _dateTo, _uuid, _scalesStationUuid} = router.query;

	const [uuidProductType, setUuidProductType] = useState<string>('');
	const [uuidSpecification, setUuidSpecification] = useState<string>('');
	const [listCompanyUuid, setListCompanyUuid] = useState<any[]>([]);

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 100,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
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

	const listDebtBill = useQuery(
		[
			QUERY_KEY.table_cong_no_phieu_nha_cung_cap,
			_page,
			listCompanyUuid,
			_pageSize,
			_q,
			_dateFrom,
			_dateTo,
			_uuid,
			uuidSpecification,
			uuidProductType,
			_scalesStationUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: debtBillServices.getListDebtBill({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_q as string) || '',
						isDescending: CONFIG_DESCENDING.IS_DESCENDING,
						status: [STATUS_BILL.DA_CAN_CHUA_KCS, STATUS_BILL.DA_KCS, STATUS_BILL.CHOT_KE_TOAN],
						partnerUuid: (_uuid as string) || '',
						userUuid: '',
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
			select(data) {
				return data;
			},
			enabled: !!_uuid,
		}
	);

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

	useEffect(() => {
		if (uuidProductType) {
			setUuidSpecification('');
		}
	}, [uuidProductType]);

	return (
		<FlexLayout isPage={false}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_q' placeholder='Tìm kiếm theo mã lô hàng' />
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
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.LAST_MONTH} />
					</div>
				</div>
			</div>
			<FullColumnFlex>
				<DataWrapper
					data={listDebtBill?.data?.items || []}
					loading={listDebtBill?.isLoading}
					noti={<Noti disableButton={true} title='Dữ liệu trống!' des='Danh sách công nợ phiếu trống!' />}
				>
					<Table
						fixedHeader={true}
						data={listDebtBill?.data?.items || []}
						column={[
							{
								title: 'Mã lô',
								fixedLeft: true,
								render: (data: IDebtBill) => <p style={{fontWeight: 600}}>{data?.code}</p>,
							},
							{
								title: 'Thời gian nhập',
								render: (data: IDebtBill) => (
									<p>{data?.timeEnd ? <Moment date={data?.timeEnd} format='DD/MM/YYYY' /> : '---'}</p>
								),
							},
							{
								title: 'Mã tàu/xe',
								render: (data: IDebtBill) => (
									<>{data?.shipUu?.licensePalate || data?.weightSessionUu?.truckUu?.licensePalate || '---'}</>
								),
							},
							// {
							// 	title: 'Mã tàu',
							// 	render: (data: IDebtBill) => <>{data?.shipUu?.licensePalate || '---'}</>,
							// },
							// {
							// 	title: 'Biển số xe',
							// 	render: (data: IDebtBill) => <>{data?.truckUu?.licensePalate || '---'}</>,
							// },
							{
								title: 'Loại hàng',
								render: (data: IDebtBill) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Quy cách',
								render: (data: IDebtBill) => <>{data?.specificationsUu?.name || '---'}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Tổng hàng
										<br />
										(Tấn)
									</span>
								),
								render: (data: IDebtBill) => <>{convertWeight(data?.totalWeight1 || 0)}</>,
							},
							{
								title: 'Bì xe (Tấn)',
								render: (data: IDebtBill) => <>{convertWeight(data?.totalWeight2 || 0)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										TL thực tế
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
								title: (
									<span className={styles.unit}>
										Đơn giá
										<br />
										(VNĐ)
									</span>
								),
								render: (data: IDebtBill) => <>{convertCoin(data?.priceTagUu?.amount || 0)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Thành tiền
										<br />
										(VNĐ)
									</span>
								),
								render: (data: IDebtBill) => <>{convertCoin(data?.moneyTotal || 0)}</>,
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 200}
					total={listDebtBill?.data?.pagination?.totalCount}
					dependencies={[
						_pageSize,
						_q,
						_dateFrom,
						_dateTo,
						_uuid,
						listCompanyUuid,
						uuidSpecification,
						uuidProductType,
						_scalesStationUuid,
					]}
				/>
			</FullColumnFlex>
		</FlexLayout>
	);
}

export default TableImport;
