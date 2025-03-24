import React, {useState} from 'react';

import {PropsPopupUpdatePrice} from './interfaces';
import styles from './PopupUpdatePrice.module.scss';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_CUSTOMER,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import priceTagServices from '~/services/priceTagServices';
import storageServices from '~/services/storageServices';
import customerServices from '~/services/customerServices';

function PopupUpdatePrice({customerSpecUuid, onClose}: PropsPopupUpdatePrice) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{
		specUuid: string;
		productTypeUuid: string;
		customerName: string;
		storageUuid: string;
		typeCustomer: number;
	}>({
		specUuid: '',
		productTypeUuid: '',
		customerName: '',
		storageUuid: '',
		typeCustomer: TYPE_CUSTOMER.KH_NHAP,
	});

	const resetForm = () => {
		setForm({
			specUuid: '',
			productTypeUuid: '',
			customerName: '',
			storageUuid: '',
			typeCustomer: TYPE_CUSTOMER.KH_NHAP,
		});
	};

	const {isSuccess} = useQuery([QUERY_KEY.chi_tiet_gia_tien_hang], {
		queryFn: () =>
			httpRequest({
				http: priceTagServices.detailCustomerSpec({
					uuid: customerSpecUuid,
				}),
			}),

		onSuccess(data) {
			if (data) {
				setForm({
					specUuid: data?.specUu?.uuid || '',
					productTypeUuid: data?.productTypeUu?.uuid || '',
					customerName: data?.customerUu?.name || '',
					storageUuid: data?.storageUu?.uuid || '',
					typeCustomer: data?.customerUu?.typeCus || '',
				});
			}
		},
		enabled: !!customerSpecUuid,
	});

	const listSpecifications = useQuery([QUERY_KEY.dropdown_quy_cach, form.productTypeUuid], {
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
					productTypeUuid: form.productTypeUuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form.productTypeUuid,
	});

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go, form.typeCustomer], {
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
					type:
						form.typeCustomer == TYPE_CUSTOMER.KH_DICH_VU
							? [TYPE_PRODUCT.DICH_VU, TYPE_PRODUCT.DUNG_CHUNG]
							: [TYPE_PRODUCT.CONG_TY, TYPE_PRODUCT.DUNG_CHUNG],
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form.typeCustomer && isSuccess,
	});

	const listStorage = useQuery([QUERY_KEY.dropdown_bai, form.specUuid, form.productTypeUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: storageServices.listStorage({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					specificationsUuid: form.specUuid,
					productUuid: form.productTypeUuid,
					warehouseUuid: '',
					qualityUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form.specUuid && !!form.productTypeUuid,
	});

	const funcUpdateStorage = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới thành công!',
				http: customerServices.updateStorage({
					customerSpecUuid: customerSpecUuid,
					storageUuid: form.storageUuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				resetForm();
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_khach_hang]);
				queryClient.invalidateQueries([QUERY_KEY.table_hang_hoa_cua_khach_hang]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (!form.specUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại quy cách!'});
		}
		if (!form.productTypeUuid) {
			return toastWarn({msg: 'Vui lòng chọn loại hàng!'});
		}

		return funcUpdateStorage.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateStorage.isLoading} />
			<h4 className={styles.title}>Cập nhật bãi</h4>
			<Form form={form} setForm={setForm}>
				<div className='mt'>
					<Input
						readOnly
						name='customerName'
						value={form.customerName}
						placeholder='Nhập tên nhà cung cấp'
						label={
							<span>
								Tên nhà cung cấp <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
				</div>
				<div className={clsx('mt')}>
					<Select
						isSearch
						name='productTypeUuid'
						value={form.productTypeUuid}
						placeholder='Lựa chọn loại hàng'
						readOnly={true}
						label={
							<span>
								Loại hàng<span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listProductType?.data?.map((value: any) => (
							<Option
								key={value.uuid}
								title={value.name}
								value={value.uuid}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										productTypeUuid: value.uuid,
										specUuid: '',
									}))
								}
							/>
						))}
					</Select>
					<Select
						isSearch
						name='specUuid'
						placeholder='Lựa chọn quy cách'
						value={form.specUuid}
						readOnly={true}
						label={
							<span>
								Quy cách <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listSpecifications?.data?.map((value: any) => (
							<Option
								key={value.uuid}
								title={value?.name}
								value={value?.uuid}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										specUuid: value.uuid,
									}))
								}
							/>
						))}
					</Select>
					<Select
						isSearch
						name='storageUuid'
						placeholder='Lựa chọn bãi'
						value={form.storageUuid}
						readOnly={!form.specUuid || !form.productTypeUuid}
						label={
							<span>
								Bãi <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listStorage?.data?.map((value: any) => (
							<Option
								key={value.uuid}
								title={value?.name}
								value={value?.uuid}
								onClick={() =>
									setForm((prev: any) => ({
										...prev,
										storageUuid: value.uuid,
									}))
								}
							/>
						))}
					</Select>
				</div>
				<div className={styles.control}>
					<div>
						<Button p_8_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<Button disable={!form.specUuid || !form.productTypeUuid} p_8_24 rounded_2 primary onClick={handleSubmit}>
							Xác nhận
						</Button>
					</div>
				</div>
				<div className={styles.icon_close} onClick={onClose}>
					<IoClose size={24} color='#23262F' />
				</div>
			</Form>
		</div>
	);
}

export default PopupUpdatePrice;
