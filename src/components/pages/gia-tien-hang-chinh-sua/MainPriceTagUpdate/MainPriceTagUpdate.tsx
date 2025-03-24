import React from 'react';
import {IPriceTagUpdate, PropsMainPriceTagUpdate} from './interfaces';
import styles from './MainPriceTagUpdate.module.scss';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_PRODUCT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {useRouter} from 'next/router';
import priceTagServices from '~/services/priceTagServices';
import Table from '~/components/common/Table';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Link from 'next/link';
import Pagination from '~/components/common/Pagination';
import IconCustom from '~/components/common/IconCustom';
import Moment from 'react-moment';
import {FaRegEye} from 'react-icons/fa';
import {convertCoin} from '~/common/funcs/convertCoin';

function MainPriceTagUpdate({}: PropsMainPriceTagUpdate) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _specificationUuid, _productTypeUuid, _transportType, _dateFrom, _dateTo} = router.query;

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

	const listSpecifications = useQuery([QUERY_KEY.dropdown_quy_cach], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 100,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listUpdatePriceTag = useQuery(
		[
			QUERY_KEY.table_gia_tien_hang,
			_page,
			_pageSize,
			_keyword,
			_specificationUuid,
			_productTypeUuid,
			_transportType,
			_dateFrom,
			_dateTo,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: priceTagServices.getListUpdatePriceTag({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						status: null,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.DROPDOWN,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationUuid: (_specificationUuid as string) || '',
						timeStart: (_dateFrom as string) || null,
						timeEnd: (_dateTo as string) || null,
						transportType: !!_transportType ? Number(_transportType) : null,
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
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo nhà cung cấp, công ty' />
					</div>

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Loại hàng'
							query='_productTypeUuid'
							listFilter={listProductType?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
					{/* <div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Quy cách'
							query='_specificationUuid'
							listFilter={listSpecifications?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div> */}

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Vận chuyển'
							query='_transportType'
							listFilter={[
								{
									id: TYPE_TRANSPORT.DUONG_BO,
									name: 'Đường bộ',
								},
								{
									id: TYPE_TRANSPORT.DUONG_THUY,
									name: 'Đường thủy',
								},
							]}
						/>
					</div>
					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' />
					</div>
				</div>
				<div>
					<Button
						p_8_16
						rounded_2
						href={PATH.ThemThayDoiGiaTienChinhSua}
						icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
					>
						Thay đổi giá tiền
					</Button>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listUpdatePriceTag?.data?.items || []}
					loading={listUpdatePriceTag?.isLoading}
					noti={
						<Noti
							titleButton='Thay đổi giá tiền'
							onClick={() => router.push(PATH.ThemThayDoiGiaTienChinhSua)}
							des='Hiện tại chưa có giá tiền chỉnh sửa nào, thêm ngay?'
						/>
					}
				>
					<Table
						data={listUpdatePriceTag?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IPriceTagUpdate, index: number) => <>{index + 1}</>,
							},

							// {
							// 	title: 'Công ty',
							// 	fixedLeft: true,
							// 	render: (data: IPriceTagUpdate) => (
							// 		<Link href={`/gia-tien-hang/gia-hang-chinh-sua/${data?.uuid}`} className={styles.link}>
							// 			{data?.partnerUu?.name || '---'}
							// 		</Link>
							// 	),
							// },
							{
								title: 'Nhà cung cấp',
								render: (data: IPriceTagUpdate) => (
									<Link href={`/xuong/${data?.customerUu?.uuid}`} className={styles.link}>
										{data?.customerUu?.name || '---'}
									</Link>
								),
							},
							{
								title: 'Giá tiền mới (VNĐ)',
								render: (data: IPriceTagUpdate) => (
									<span style={{color: 'var(--primary)'}}>{convertCoin(data?.priceUu?.amount) || 0}</span>
								),
							},
							{
								title: 'Loại hàng',
								render: (data: IPriceTagUpdate) => <>{data?.productTypeUu?.name || '---'}</>,
							},

							{
								title: 'Số phiếu cân áp dụng',
								render: (data: IPriceTagUpdate) => <span style={{color: 'var(--primary)'}}>{data?.totalCount}</span>,
							},
							{
								title: 'Vận chuyển',
								render: (data: IPriceTagUpdate) => (
									<>
										{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
										{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
									</>
								),
							},
							{
								title: 'Thời gian áp dụng',
								render: (data: IPriceTagUpdate) => (
									<>
										<Moment date={data.timeStart} format='DD/MM/YYYY' /> -
										<Moment date={data.timeEnd} format='DD/MM/YYYY' />
									</>
								),
							},

							{
								title: 'Ngày thay đổi',
								render: (data: IPriceTagUpdate) =>
									data.created ? <Moment date={data.created} format='HH:mm, DD/MM/YYYY' /> : '---',
							},
							{
								title: 'Tác vụ',
								selectRow: true,
								fixedRight: true,
								render: (data: IPriceTagUpdate) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											icon={<FaRegEye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											href={`/gia-tien-hang-chinh-sua/${data?.uuid}`}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listUpdatePriceTag?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 200}
					dependencies={[_pageSize, _keyword, _specificationUuid, _productTypeUuid, _transportType, _dateFrom, _dateTo]}
				/>
			</div>
		</div>
	);
}

export default MainPriceTagUpdate;
