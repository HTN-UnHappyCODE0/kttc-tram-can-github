import React, {useState} from 'react';

import {PropsFormRecoverDebt} from './interfaces';
import styles from './FormRecoverDebt.module.scss';
import clsx from 'clsx';
import Form, {FormContext, Input} from '~/components/common/Form';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import TextArea from '~/components/common/Form/components/TextArea';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, TYPE_TRANSACTION} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import partnerServices from '~/services/partnerServices';
import transactionServices from '~/services/transactionServices';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import {toastWarn} from '~/common/funcs/toast';
import uploadImageService from '~/services/uploadService';
import {getTextAddress, numberToWords, timeSubmit} from '~/common/funcs/optionConvert';
import Loading from '~/components/common/Loading';
import moment from 'moment';
import DatePicker2 from '~/components/common/DatePicker2';

function FormRecoverDebt({onClose}: PropsFormRecoverDebt) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<any[]>([]);
	const [form, setForm] = useState<{amountCash: number; amountBank: number; description: string; transTime: string}>({
		amountBank: 0,
		amountCash: 0,
		description: '',
		transTime: '',
	});

	const {data: detailPartnerDebt} = useQuery([QUERY_KEY.chi_tiet_doi_tac_thu_hoi, _uuid], {
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

	const funcRecoverDebt = useMutation({
		mutationFn: (body: {paths: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thu hồi công nợ thành công!',
				http: transactionServices.upsertTransaction({
					uuid: '',
					type: TYPE_TRANSACTION.THU_HOI,
					partnerUuid: _uuid as string,
					amountBank: price(form.amountBank),
					amountCash: price(form.amountCash),
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
			console.log({error});
		},
	});

	const handleSubmit = async () => {
		if (price(form.amountBank) == 0 && price(form.amountCash) == 0) {
			return toastWarn({msg: 'Vui lòng nhập số tiền thanh toán!'});
		}

		const imgs = images?.map((v: any) => v?.file);

		if (!form.transTime) {
			return toastWarn({msg: 'Vui lòng chọn ngày thu hồi!'});
		}

		if (imgs.length > 0) {
			const dataImage = await httpRequest({
				setLoading,
				isData: true,
				http: uploadImageService.uploadMutilImage(imgs),
			});

			if (dataImage?.error?.code == 0) {
				return funcRecoverDebt.mutate({
					paths: dataImage.items,
				});
			} else {
				return toastWarn({msg: 'Upload ảnh thất bại!'});
			}
		} else {
			return funcRecoverDebt.mutate({
				paths: [],
			});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcRecoverDebt.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.wrapper}>
					<h4>Thu hồi công nợ</h4>
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
						<h5>Phương thức thanh toán :</h5>
						<div className={styles.form}>
							<div className='col_2'>
								<Input
									name='amountCash'
									value={form.amountCash || ''}
									type='text'
									isMoney
									unit='VNĐ'
									blur={true}
									label={
										<span>
											Tiền mặt <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập số tiền'
									note={numberToWords(price(form.amountCash))}
								/>
								<div>
									<Input
										name='amountBank'
										value={form.amountBank || ''}
										type='text'
										isMoney
										unit='VNĐ'
										blur={true}
										label={
											<span>
												Tiền chuyển khoản <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder='Nhập số tiền'
										note={numberToWords(price(form.amountBank))}
									/>
								</div>
							</div>
							<div className={'mt'}>
								{/* <Input
									type='date'
									name='transTime'
									value={form.transTime || ''}
									blur={true}
									isRequired={true}
									label={
										<span>
											Ngày thu hồi <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập ngày thu hồi'
								/> */}
								<DatePicker2
									onClean={true}
									icon={true}
									label={
										<span>
											Ngày thu hồi <span style={{color: 'red'}}>*</span>
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

export default FormRecoverDebt;
