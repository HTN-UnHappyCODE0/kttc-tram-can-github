import React, {useState} from 'react';
import styles from './PageDebtHistory.module.scss';
import {ITransaction, PropsPageDebtHistory} from './interface';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import {useRouter} from 'next/router';
import Table from '~/components/common/Table';
import StatePaymentMode from '../StatePaymentMode';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_TRANSACTION,
	TYPE_DATE,
	TYPE_PARTNER,
	TYPE_TRANSACTION,
} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import partnerServices from '~/services/partnerServices';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Moment from 'react-moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import Pagination from '~/components/common/Pagination';
import Link from 'next/link';
import Popup from '~/components/common/Popup';
import PopupDetailDebtHistory from '../PopupDetailDebtHistory';
import transactionServices from '~/services/transactionServices';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import IconCustom from '~/components/common/IconCustom';
import {DiscountShape, DollarCircle, Edit, Eye, MoneyRecive, Trash} from 'iconsax-react';
import FormPaymentDebt from '../FormPaymentDebt';
import FormRecoverDebt from '../FormRecoverDebt';
import FormPaymentTax from '../FormPaymentTax';
import FormDeleteTransaction from '../FormDeleteTransaction';
import Tippy from '@tippyjs/react';
import TippyHeadless from '@tippyjs/react/headless';
import clsx from 'clsx';

const PageDebtHistory = ({}: PropsPageDebtHistory) => {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _partnerUuid, _dateFrom, _dateTo, _uuidTransaction, _type, _typeEdit} = router.query;

	const [uuidChangeTransaction, setUuidChangeTransaction] = useState<string>('');
	const [uuidDescription, setUuidDescription] = useState<string>('');
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
					status: CONFIG_STATUS.HOAT_DONG,
					userUuid: '',
					provinceId: '',
					type: TYPE_PARTNER.NCC,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const handleClosePopup = () => {
		const {_uuidTransaction, _typeEdit, _uuidPartner, ...rest} = router.query;

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

	const listTransaction = useQuery(
		[QUERY_KEY.table_lich_su_thanh_toan, _page, _pageSize, _keyword, _partnerUuid, _type, _dateFrom, _dateTo],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: transactionServices.listTransaction({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						status: CONFIG_STATUS.HOAT_DONG,
						type: !!_type ? Number(_type) : null,
						partnerUuid: (_partnerUuid as string) || '',
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
					}),
				}),
			select(data) {
				return data;
			},
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
		<FlexLayout isPage={true}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã GD' />
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
						<FilterCustom
							isSearch
							name='Hình thức'
							query='_type'
							listFilter={[
								{id: TYPE_TRANSACTION.THU_HOI, name: 'Thu hồi công nợ'},
								{id: TYPE_TRANSACTION.THANH_TOAN, name: 'Thanh toán công nợ'},
								{id: TYPE_TRANSACTION.THUE, name: 'Thanh toán thuế'},
							]}
						/>
					</div>
					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.YESTERDAY} />
					</div>
				</div>
			</div>

			<div className={clsx('mt', 'mb')}>
				<div className={styles.parameter}>
					<div>
						TỔNG THU HỒI: <span style={{marginLeft: 4}}>{convertCoin(listTransaction?.data?.totalMoneyIn)} VNĐ</span>
					</div>
					<div>
						TỔNG THANH TOÁN: <span style={{marginLeft: 4}}>{convertCoin(listTransaction?.data?.totalMoneyOut)} VNĐ</span>
					</div>
					<div>
						TỔNG THUẾ: <span style={{marginLeft: 4}}>{convertCoin(listTransaction?.data?.totalMoneyTax)} VNĐ</span>
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
								render: (data: ITransaction, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã giao dịch',
								fixedLeft: true,
								render: (data: ITransaction) => (
									<Link
										href={`/lich-su-thanh-toan?_uuidTransaction=${data?.uuid}`}
										className={styles.link}
										style={{fontWeight: 600}}
									>
										{data?.code || '---'}
									</Link>
								),
							},
							{
								title: 'Thời gian',
								render: (data: ITransaction) => <Moment date={data?.transTime} format='DD/MM/YYYY' />,
							},
							{
								title: 'Công ty',
								render: (data: ITransaction) => <p className={styles.name}>{data?.partnerUu?.name || '---'}</p>,
							},
							{
								title: 'Hóa đơn số',
								render: (data: ITransaction) => <>{data?.transCode || '---'}</>,
							},
							{
								title: 'Hình thức',
								render: (data: ITransaction) => (
									<p className={styles.state_pay}>
										<StatePaymentMode state={data?.type} />
									</p>
								),
							},
							{
								title: 'Phương thức',
								render: (data: ITransaction) => <>{getTextPaymentMethod(data?.amountCash, data?.amountBank, data?.type)}</>,
							},
							{
								title: 'Số tiền (VNĐ)',
								render: (data: ITransaction) => <>{convertCoin(data?.totalAmount)}</>,
							},
							{
								title: 'Ghi chú',
								render: (data: ITransaction) => (
									<TippyHeadless
										maxWidth={'100%'}
										interactive
										onClickOutside={() => setUuidDescription('')}
										visible={uuidDescription == data?.uuid}
										placement='bottom'
										render={(attrs) => (
											<div className={styles.main_description}>
												<p>{data?.description}</p>
											</div>
										)}
									>
										<Tippy content='Xem chi tiết mô tả'>
											<p
												onClick={() => {
													if (!data.description) {
														return;
													} else {
														setUuidDescription(uuidDescription ? '' : data.uuid);
													}
												}}
												className={clsx(styles.description, {[styles.active]: uuidDescription == data.uuid})}
											>
												{data?.description || '---'}
											</p>
										</Tippy>
									</TippyHeadless>
								),
							},
							{
								title: 'Tác vụ',
								selectRow: true,
								fixedRight: true,
								render: (data: ITransaction) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<Edit fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#3498db'
											onClick={() =>
												router.replace({
													pathname: router.pathname,
													query: {
														...router.query,
														_uuidTransaction: data?.uuid,
														_typeEdit: data?.type,
														_uuidPartner: data?.partnerUu?.uuid,
													},
												})
											}
										/>

										<IconCustom
											delete
											icon={<Trash fontSize={20} fontWeight={600} color='#C41C22' />}
											tooltip='Hủy thanh toán'
											color='#777E90'
											onClick={() => setUuidChangeTransaction(data?.uuid)}
										/>
										<IconCustom
											edit
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											color='#777E90'
											onClick={() => {
												router.replace(
													{
														pathname: router.pathname,
														query: {
															...router.query,
															_uuidTransaction: data?.uuid,
														},
													},
													undefined,
													{shallow: true, scroll: false}
												);
											}}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 200}
					total={listTransaction?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _partnerUuid, _type, _dateFrom, _dateTo]}
				/>
				<Popup open={!!_uuidTransaction && !_typeEdit} onClose={handleClosePopup}>
					<PopupDetailDebtHistory onClose={handleClosePopup} />
				</Popup>
			</FullColumnFlex>
			<Popup open={!!_uuidTransaction && _typeEdit == TYPE_TRANSACTION.THANH_TOAN.toString()} onClose={handleClosePopup}>
				<FormPaymentDebt onClose={handleClosePopup} />
			</Popup>

			<Popup open={!!_uuidTransaction && _typeEdit == TYPE_TRANSACTION.THU_HOI.toString()} onClose={handleClosePopup}>
				<FormRecoverDebt onClose={handleClosePopup} />
			</Popup>

			<Popup open={!!_uuidTransaction && _typeEdit == TYPE_TRANSACTION.THUE.toString()} onClose={handleClosePopup}>
				<FormPaymentTax onClose={handleClosePopup} />
			</Popup>

			<Popup open={!!uuidChangeTransaction} onClose={() => setUuidChangeTransaction('')}>
				<FormDeleteTransaction uuid={uuidChangeTransaction} onClose={() => setUuidChangeTransaction('')} />
			</Popup>
		</FlexLayout>
	);
};

export default PageDebtHistory;
