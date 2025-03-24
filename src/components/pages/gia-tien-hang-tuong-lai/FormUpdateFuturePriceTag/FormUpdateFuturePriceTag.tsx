import React, {useEffect, useState} from 'react';

import {PropsFormUpdateFuturePriceTag} from './interfaces';
import styles from './FormUpdateFuturePriceTag.module.scss';
import {IoClose} from 'react-icons/io5';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import Loading from '~/components/common/Loading';
import {httpRequest} from '~/services';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATE_SPEC_CUSTOMER,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import priceTagServices from '~/services/priceTagServices';
import SelectSearch from '~/components/common/SelectSearch';
import {toastWarn} from '~/common/funcs/toast';
import DatePicker from '~/components/common/DatePicker';

function FormUpdateFuturePriceTag({dataUpdate, onClose}: PropsFormUpdateFuturePriceTag) {
	const queryClient = useQueryClient();

	const [priceTag, setPriceTag] = useState<any>({});
	const [form, setForm] = useState<any>({
		timeStart: null,
		timeEnd: null,
		customer: '',
		productType: '',
		spec: '',
		transport: '',
		state: CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP,
	});

	const listPriceTag = useQuery([QUERY_KEY.dropdown_gia_tien_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: priceTagServices.listPriceTagDropDown({
					page: 1,
					pageSize: 10,
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
		if (dataUpdate) {
			setForm({
				customer: dataUpdate?.customerUu?.name,
				productType: dataUpdate?.productTypeUu?.name,
				spec: dataUpdate?.specUu?.name,
				transport:
					dataUpdate?.transportType == TYPE_TRANSPORT.DUONG_BO
						? 'Đường bộ'
						: dataUpdate?.transportType == TYPE_TRANSPORT.DUONG_THUY
						? 'Đường thủy'
						: '---',
				state: dataUpdate?.state,
			});
			setPriceTag({
				id: dataUpdate?.pricetagUu?.uuid || '',
				name: dataUpdate?.pricetagUu?.amount || 0,
			});
		}
	}, [dataUpdate]);

	const funcUpdateSpecification = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa giá tiền hàng thành công!',
				http: priceTagServices.updatePricetagToCustomer({
					uuid: dataUpdate?.uuid!,
					priceTagUuid: priceTag.id === '' ? String(priceTag.name) : priceTag.id,
					state: form.state,
					status: CONFIG_STATUS.HOAT_DONG,
					pricetagAfterUuid: '',
					timeStart: form.timeStart,
					timeEnd: form.timeEnd,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_gia_tien_hang_tuong_lai]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (!dataUpdate?.uuid) {
			return toastWarn({msg: 'Không tìm thấy giá thay đổi!'});
		}

		return funcUpdateSpecification.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateSpecification.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.main_form}>
					<h4 className={styles.title}>Chỉnh sửa giá tiền</h4>
					<div className={styles.main}>
						<div className={'mt'}>
							<Input
								placeholder='Nhập nhà cung cấp'
								name='customer'
								readOnly={true}
								label={
									<span>
										Nhà cung cấp <span style={{color: 'red'}}>*</span>
									</span>
								}
							/>
							<Input
								placeholder='Loại hàng'
								name='productType'
								readOnly={true}
								label={
									<span>
										Loại hàng <span style={{color: 'red'}}>*</span>
									</span>
								}
							/>
							<Input
								placeholder='Quy cách'
								name='spec'
								readOnly={true}
								label={
									<span>
										Quy cách <span style={{color: 'red'}}>*</span>
									</span>
								}
							/>
							<Input
								placeholder='Phương thức vận chuyển'
								name='transport'
								readOnly={true}
								label={
									<span>
										Phương thức vận chuyển <span style={{color: 'red'}}>*</span>
									</span>
								}
							/>
						</div>

						<div className={'mt'}>
							<SelectSearch
								isConvertNumber={true}
								options={listPriceTag?.data?.map((v: any) => ({
									id: v?.uuid,
									name: String(v?.amount),
								}))}
								data={priceTag}
								setData={setPriceTag}
								label={
									<span>
										Giá tiền áp dụng <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập giá tiền'
							/>
						</div>
						<div className={'mt'}>
							<DatePicker
								icon={true}
								label={
									<span>
										Áp dụng từ ngày <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Chọn ngày áp dụng'
								value={form?.timeStart}
								onSetValue={(date) =>
									setForm((prev: any) => ({
										...prev,
										timeStart: date,
									}))
								}
								name='timeStart'
								onClean={true}
							/>
						</div>
						<div className={'mt'}>
							<DatePicker
								icon={true}
								label={<span>Ngày kết thúc</span>}
								placeholder='Chọn ngày kết thúc'
								value={form?.timeEnd}
								onSetValue={(date) =>
									setForm((prev: any) => ({
										...prev,
										timeEnd: date,
									}))
								}
								name='timeEnd'
								onClean={true}
							/>
						</div>
					</div>

					<div className={styles.control}>
						<div>
							<Button p_8_24 rounded_2 grey_outline onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<FormContext.Consumer>
								{({isDone}) => (
									<Button disable={!isDone} p_10_24 rounded_2 primary>
										Xác nhận
									</Button>
								)}
							</FormContext.Consumer>
						</div>
					</div>
				</div>
			</Form>
			<div className={styles.icon_close} onClick={onClose}>
				<IoClose size={24} color='#23262F' />
			</div>
		</div>
	);
}

export default FormUpdateFuturePriceTag;
