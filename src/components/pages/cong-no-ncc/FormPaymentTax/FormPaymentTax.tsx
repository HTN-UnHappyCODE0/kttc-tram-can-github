import React, {useState} from 'react';

import {PropsFormPaymentTax} from './interfaces';
import styles from './FormPaymentTax.module.scss';
import clsx from 'clsx';
import Form, {FormContext, Input} from '~/components/common/Form';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import TextArea from '~/components/common/Form/components/TextArea';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import transactionServices from '~/services/transactionServices';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import uploadImageService from '~/services/uploadService';
import {toastWarn} from '~/common/funcs/toast';
import {QUERY_KEY} from '~/constants/config/enum';
import partnerServices from '~/services/partnerServices';
import Loading from '~/components/common/Loading';
import {getTextAddress, numberToWords} from '~/common/funcs/optionConvert';
import moment from 'moment';
import DatePicker2 from '~/components/common/DatePicker2';

function FormPaymentTax({onClose}: PropsFormPaymentTax) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<any[]>([]);
	const [form, setForm] = useState<{transCode: string; taxAmount: number; description: string; transTime: string}>({
		transCode: '',
		taxAmount: 0,
		transTime: '',
		description: '',
	});

	const {data: detailPartnerDebt} = useQuery([QUERY_KEY.chi_tiet_doi_tac_thue, _uuid], {
		queryFn: () =>
			httpRequest({
				http: partnerServices.detailPartnerDebt({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	const funcPaymentTax = useMutation({
		mutationFn: (body: {paths: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thanh toán thuế thành công!',
				http: transactionServices.upsertTax({
					uuid: '',
					partnerUuid: _uuid as string,
					taxAmount: price(form.taxAmount),
					transCode: form.transCode,
					description: form.description,
					transTime: moment(form.transTime).format('YYYY-MM-DD'),
					paths: body.paths,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_cong_no_nha_cung_cap]);
			}
		},
		onError(error) {
			return;
		},
	});

	const handleSubmit = async () => {
		const imgs = images?.map((v: any) => v?.file);

		if (!form.transTime) {
			return toastWarn({msg: 'Vui lòng chọn ngày thanh toán!'});
		}

		if (imgs.length > 0) {
			const dataImage = await httpRequest({
				setLoading,
				isData: true,
				http: uploadImageService.uploadMutilImage(imgs),
			});

			if (dataImage?.error?.code == 0) {
				return funcPaymentTax.mutate({
					paths: dataImage.items,
				});
			} else {
				return toastWarn({msg: 'Upload ảnh thất bại!'});
			}
		} else {
			return funcPaymentTax.mutate({
				paths: [],
			});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcPaymentTax.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.wrapper}>
					<h4>Thanh toán thuế</h4>
					<div className={clsx('mt', styles.box)}>
						<div className={styles.text_item}>
							<p>
								Công ty: {detailPartnerDebt?.name} <span>({detailPartnerDebt?.code})</span>
							</p>
						</div>
						<div className={styles.text_item}>
							<p>Số điện thoại: {detailPartnerDebt?.phoneNumber}</p>
						</div>
						<div className={styles.text_item}>
							<p>Địa chỉ: {getTextAddress(detailPartnerDebt?.detailAddress, detailPartnerDebt?.address)}</p>
						</div>
					</div>
					<div className={clsx('mt', styles.box)}>
						<div className={styles.text_item}>
							<p>Tổng công nợ:</p>
							<span>{convertCoin(detailPartnerDebt?.debtTotal)}</span>
						</div>
					</div>
					<div className={clsx('mt', styles.main_form)}>
						<div className={styles.form}>
							<Input
								name='transCode'
								value={form.transCode || ''}
								type='text'
								isRequired
								blur={true}
								label={
									<span>
										Số hóa đơn <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập số hóa đơn'
							/>
							<div className={clsx('col_2', 'mt')}>
								<div>
									<Input
										name='taxAmount'
										value={form.taxAmount || ''}
										type='text'
										isMoney
										unit='VNĐ'
										blur={true}
										label={
											<span>
												Tiền thuế <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder='Nhập số tiền'
										note={numberToWords(price(form.taxAmount))}
									/>
								</div>
								{/* <Input
									type='date'
									name='transTime'
									value={form.transTime || ''}
									blur={true}
									isRequired={true}
									label={
										<span>
											Ngày thanh toán <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập ngày thanh toán'
								/> */}

								<DatePicker2
									onClean={true}
									icon={true}
									label={
										<span>
											Ngày thanh toán <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='dd/mm/yyyy'
									value={form?.transTime}
									onSetValue={(time) =>
										setForm((prev) => ({
											...prev,
											transTime: time,
										}))
									}
									name='transTime'
								/>
							</div>
							<div className='mt'>
								<TextArea name='description' placeholder='Nhập ghi chú' label='Ghi chú' />
							</div>
							<div className='mt'>
								<div className={styles.image_upload}>Chọn ảnh</div>
								<UploadMultipleFile images={images} setImages={setImages} />
							</div>
						</div>
					</div>

					<div className={styles.control}>
						<div>
							<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
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

			<div className={styles.close} onClick={onClose}>
				<IoClose />
			</div>
		</div>
	);
}

export default FormPaymentTax;
