import React, {useState} from 'react';

import {PropsFormPaymentDebt} from './interfaces';
import styles from './FormPaymentDebt.module.scss';
import clsx from 'clsx';
import Form, {FormContext, Input} from '~/components/common/Form';
import UploadMultipleFile from '~/components/common/UploadMultipleFile';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import TextArea from '~/components/common/Form/components/TextArea';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import transactionServices from '~/services/transactionServices';
import {QUERY_KEY, TYPE_TRANSACTION} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import partnerServices from '~/services/partnerServices';
import {getTextAddress, numberToWords} from '~/common/funcs/optionConvert';
import uploadImageService from '~/services/uploadService';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import moment from 'moment';
import {IDetailTransaction} from '../PopupDetailDebtHistory/interfaces';
import DatePicker2 from '~/components/common/DatePicker2';

function FormPaymentDebt({onClose}: PropsFormPaymentDebt) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuidTransaction, _uuidPartner} = router.query;

	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<any[]>([]);

	const [form, setForm] = useState<{amountCash: number | string; amountBank: number | string; description: string; transTime: string}>({
		amountBank: 0,
		amountCash: 0,
		transTime: '',
		description: '',
	});

	useQuery<IDetailTransaction>([QUERY_KEY.chi_tiet_lich_su_thanh_toan, _uuidTransaction], {
		queryFn: () =>
			httpRequest({
				http: transactionServices.detailTransaction({
					uuid: _uuidTransaction as string,
				}),
			}),
		onSuccess(data) {
			setForm({
				amountBank: convertCoin(data?.amountBank) || 0,
				amountCash: convertCoin(data?.amountCash) || 0,
				transTime: moment(data.transTime).format('yyyy-MM-DD'),
				description: data?.description || '',
			});
			setImages(
				data?.path?.map((v: any) => ({
					file: null,
					img: v,
					path: `${process.env.NEXT_PUBLIC_IMAGE}/${v}`,
				})) || []
			);
		},
		enabled: !!_uuidTransaction,
	});

	const {data: detailPartnerDebt} = useQuery([QUERY_KEY.chi_tiet_doi_tac_thanh_toan, _uuidPartner], {
		queryFn: () =>
			httpRequest({
				http: partnerServices.detailPartnerDebt({
					uuid: _uuidPartner as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuidPartner,
	});

	const funcPaymentDebt = useMutation({
		mutationFn: (body: {paths: string[]}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thanh toán công nợ thành công!',
				http: transactionServices.upsertTransaction({
					uuid: _uuidTransaction as string,
					type: TYPE_TRANSACTION.THANH_TOAN,
					partnerUuid: _uuidPartner as string,
					amountBank: price(form.amountBank),
					amountCash: price(form.amountCash),
					description: form.description,
					transTime: moment(form.transTime).format('YYYY-MM-DD'),
					paths: body.paths,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.table_cong_no_nha_cung_cap]);
				onClose();
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
		if (!form.transTime) {
			return toastWarn({msg: 'Vui lòng chọn ngày thanh toán!'});
		}

		// Lấy ra danh sách ảnh có trước
		const currentImage = images.filter((item) => !!item.img).map((v) => v.img);

		// Lấy ra danh sách file
		const files = images?.filter((x: any) => !!x.file)?.map((v: any) => v?.file);

		if (files.length > 0) {
			const dataImage = await httpRequest({
				setLoading,
				isData: true,
				http: uploadImageService.uploadMutilImage(files),
			});
			if (dataImage?.error?.code == 0) {
				return funcPaymentDebt.mutate({
					paths: [...currentImage, ...dataImage.items],
				});
			} else {
				return toastWarn({msg: 'Upload ảnh thất bại!'});
			}
		} else {
			return funcPaymentDebt.mutate({
				paths: currentImage,
			});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcPaymentDebt.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.wrapper}>
					<h4>Thanh toán công nợ</h4>
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
							<span>{convertCoin(detailPartnerDebt?.debtTotal)}(VNĐ)</span>
						</div>
					</div>
					<div className={clsx('mt', styles.main_form)}>
						<h5>Phương thức thanh toán :</h5>

						<div className={styles.form}>
							<div className='col_2'>
								<Input
									name='amountCash'
									value={form.amountCash || ''}
									readOnly={true}
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
										readOnly={true}
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
									readOnly={true}
									name='transTime'
									value={form.transTime || ''}
									isRequired={true}
									blur={true}
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

export default FormPaymentDebt;
