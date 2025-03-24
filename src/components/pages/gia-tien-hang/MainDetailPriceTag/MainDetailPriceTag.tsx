import React from 'react';

import {PropsMainDetailPriceTag} from './interfaces';
import styles from './MainDetailPriceTag.module.scss';
import {PATH} from '~/constants/config';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import {LuPencil} from 'react-icons/lu';
import GridColumn from '~/components/layouts/GridColumn';
import DetailBox from '~/components/common/DetailBox';

function MainDetailPriceTag({}: PropsMainDetailPriceTag) {
	return (
		<div className={styles.container}>
			{/* <Loading loading={funcChangeStatus.isLoading} /> */}
			<div className={styles.header}>
				<Link href={PATH.GiaTienHangHienTai} className={styles.header_title}>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Chi tiết giá tiền hàng</p>
				</Link>

				<div className={styles.list_btn}>
					<Button rounded_2 w_fit light_outline p_8_16 bold icon={<LuPencil color='#23262F' fontSize={16} fontWeight={600} />}>
						Chỉnh sửa giá tiền
					</Button>
				</div>
			</div>

			<div className={'mt'}>
				<GridColumn col_4>
					<DetailBox name={'Loại hàng'} value={24} />
					<DetailBox name={'Quy cách'} value={32} />
					<DetailBox name={'Vận chuyển'} value={4} />
					<DetailBox name={'Giá tiền hiện tại'} value={5} />
				</GridColumn>
			</div>

			<div className={'mt'}>
				<table className={styles.container_table}>
					<colgroup>
						<col style={{width: '50%'}} />
						<col style={{width: '50%'}} />
					</colgroup>
					{/* <tr>
						<td>
							<span>Mã khách hàng: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.code || '---'}</span>
						</td>
						<td>
							<span>Tên khách hàng: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.name || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Mã số thuế: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.taxCode || '---'}</span>
						</td>
						<td>
							<span>Người liên hệ:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.director || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Email: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.email || '---'}</span>
						</td>
						<td>
							<span>Số điện thoại:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.phoneNumber || '---'}</span>
						</td>
					</tr> */}
					{/* <tr>
						<td>
							<span>Loại khách hàng:</span>
							<span style={{marginLeft: '6px'}}>
								{detailCustomer?.typeCus == TYPE_CUSTOMER.KH_NHAP
									? 'Khách hàng nhập'
									: detailCustomer?.typeCus == TYPE_CUSTOMER.KH_XUAT
									? 'Khách hàng xuất'
									: '---'}
							</span>
						</td>
						<td>
							<span>Phân loại hàng:</span>
							<span style={{marginLeft: '6px'}}>
								{detailCustomer?.isSift == TYPE_SIFT.CAN_SANG
									? 'Cần sàng'
									: detailCustomer?.isSift == TYPE_SIFT.KHONG_CAN_SANG
									? 'Không cần sàng'
									: '---'}
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Loại vận chuyển:</span>
							<span style={{marginLeft: '6px'}}>
								{detailCustomer?.transportType == TYPE_TRANSPORT.DUONG_BO
									? 'Đường bộ'
									: detailCustomer?.transportType == TYPE_TRANSPORT.DUONG_THUY
									? 'Đường thủy'
									: '---'}
							</span>
						</td>
						<td rowSpan={3} className={styles.description}>
							<span>Mô tả:</span>
							<span style={{marginLeft: '6px'}}>{detailCustomer?.description || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Trạng thái: </span>
								<span style={{marginLeft: '6px'}}>
									<TagStatus status={detailCustomer?.status} />
								</span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<span>Địa chỉ:</span>
							<span style={{marginLeft: '6px'}}>
								{getTextAddress(detailCustomer?.detailAddress, detailCustomer?.address)}
							</span>
						</td>
					</tr> */}
				</table>
			</div>
		</div>
	);
}

export default MainDetailPriceTag;
