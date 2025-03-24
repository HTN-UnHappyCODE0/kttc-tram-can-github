import React, {use, useState} from 'react';

import {IDetailFixPricetag, PropsMainDetailPriceTagUpdate, IhistoryFixPriceBill} from './interfaces';
import styles from './MainDetailPriceTagUpdate.module.scss';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';
import {LuPencil} from 'react-icons/lu';
import {IoArrowBackOutline} from 'react-icons/io5';
import clsx from 'clsx';
import GridColumn from '~/components/layouts/GridColumn';

import Link from 'next/link';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {convertCoin} from '~/common/funcs/convertCoin';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, TYPE_TRANSPORT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import priceTagServices from '~/services/priceTagServices';

import Moment from 'react-moment';
import ItemDashboard from './ItemDashboard';

function MainDetailPriceTagUpdate({}: PropsMainDetailPriceTagUpdate) {
	const router = useRouter();
	const {_id} = router.query;

	const {data: detailFixPricetag, isLoading} = useQuery<IDetailFixPricetag>([QUERY_KEY.chi_tiet_gia_tien_chinh_sua, _id], {
		queryFn: () =>
			httpRequest({
				http: priceTagServices.detailFixPricetag({
					uuid: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	// const [openUpdate, setOpenUpdate] = useState<IDetailFixPricetag | null>(null);
	return (
		<div>
			<div className={styles.header}>
				<Link href={PATH.GiaTienHangChinhSua} className={styles.header_title}>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Chi tiết giá tiền chỉnh sửa</p>
				</Link>
				{/* <div className={styles.list_btn}>
					<Button
						rounded_2
						w_fit
						light_outline
						p_8_16
						bold
						icon={<LuPencil color='#23262F' fontSize={16} fontWeight={600} />}
					>
						Chỉnh sửa giá tiền
					</Button>
				</div> */}
			</div>
			<div>
				<div className={clsx('mt')}>
					<GridColumn col_3>
						<ItemDashboard text='Công ty' color='#2D74FF' value={detailFixPricetag?.customerUu?.name} />
						<ItemDashboard text='Loại hàng' color='#2D74FF' value={detailFixPricetag?.productTypeUu?.name} />
						<ItemDashboard text='Quy cách' color='#2D74FF' value={detailFixPricetag?.specificationUu?.name} />
						<ItemDashboard text='Số lượng phiếu' color='#2D74FF' value={detailFixPricetag?.totalCount} />
						<ItemDashboard
							text='Vận chuyển'
							color='#2D74FF'
							value={
								detailFixPricetag?.transportType == TYPE_TRANSPORT.DUONG_BO
									? 'Đường bộ'
									: detailFixPricetag?.transportType == TYPE_TRANSPORT.DUONG_THUY
									? 'Đường thủy'
									: '---'
							}
						/>
						<ItemDashboard text='Giá tiền hiện tại' color='#2D74FF' value={detailFixPricetag?.priceUu?.amount} unit='VNĐ' />
					</GridColumn>
				</div>
			</div>
			<div>
				<div className={clsx('mt')}>
					<h3 className={clsx('mb')}>Danh sách phiếu thay đổi</h3>
					<div className={clsx('mt', 'mb')}>
						<GridColumn col_2>
							<ItemDashboard text='Giá tiền thay đổi' color='#2D74FF' value={detailFixPricetag?.priceUu?.amount || '---'} />
							<ItemDashboard text='Người thay đổi' color='#2D74FF' value={detailFixPricetag?.creatorUu?.username || '---'} />
						</GridColumn>
					</div>
					<div className={styles.table}>
						<DataWrapper
							data={detailFixPricetag?.historyFixPriceBill || []}
							loading={isLoading}
							noti={<Noti disableButton={true} title='Dữ liệu trống!' des='Danh sách lượt cân trống!' />}
						>
							<Table
								data={detailFixPricetag?.historyFixPriceBill || []}
								column={[
									{
										title: 'STT',
										render: (data: IhistoryFixPriceBill, index: number) => <>{index + 1}</>,
									},

									{
										title: 'Mã số phiếu',
										render: (data: IhistoryFixPriceBill) => <>{data?.billUu?.code}</>,
									},
									{
										title: 'Giá ban đầu (VNĐ)',
										render: (data: IhistoryFixPriceBill) => <>{convertCoin(data?.priceOldUu?.amount) || 0}</>,
									},
									{
										title: 'Ngày thay đổi',
										render: (data: IhistoryFixPriceBill) => (
											<>
												<Moment date={data?.created} format='DD/MM/YYYY' />
											</>
										),
									},
								]}
							/>
						</DataWrapper>
					</div>
					{/* <Popup open={!!openUpdate} onClose={() => setOpenUpdate(null)}>
						<FormUpdatePriceTag openUpdate={openUpdate} onClose={() => setOpenUpdate(null)} />
					</Popup> */}
				</div>
			</div>
		</div>
	);
}

export default MainDetailPriceTagUpdate;
