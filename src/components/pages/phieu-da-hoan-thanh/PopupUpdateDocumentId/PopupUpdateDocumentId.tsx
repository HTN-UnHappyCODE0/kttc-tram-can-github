import React, {useState} from 'react';
import {PopupUpdateDocumentId} from './interfaces';
import styles from './PopupUpdateDocumentId.module.scss';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import Form, {FormContext, Input} from '~/components/common/Form';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import batchBillServices from '~/services/batchBillServices';
import {price} from '~/common/funcs/convertCoin';
import {toastWarn} from '~/common/funcs/toast';
import debtBillServices from '~/services/debtBillServices';

function PopupWeighReject({uuid, onClose}: PopupUpdateDocumentId) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{DocumnetID: string}>({
		DocumnetID: '',
	});

	const funcSuccessWeighReject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật chứng từ thành công!',
				http: debtBillServices.updateDocumnetID({
					uuid: uuid || [],
					documentId: form.DocumnetID as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_cong_no_phieu_hoan_thanh]);
			}
		},
	});

	const handleSubmit = () => {
		if (price(form.DocumnetID) == 0) {
			return toastWarn({msg: 'Vui lòng nhập số chứng từ chất!'});
		}
		return funcSuccessWeighReject.mutate();
	};

	return (
		<div className={clsx('effectZoom', styles.popup)}>
			<Loading loading={funcSuccessWeighReject.isLoading} />
			{/* <div className={styles.iconWarn}>
				<IoHelpCircleOutline />
			</div> */}

			<p className={styles.note}>Cập nhật chứng từ</p>
			<div className={clsx('mt')}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<div className='mt'>
						<Input
							name='DocumnetID'
							value={form.DocumnetID || 0}
							type='text'
							blur={true}
							placeholder='Số chứng từ'
							label={
								<span>
									Số chứng từ<span style={{color: 'red'}}> *</span>
								</span>
							}
						/>
					</div>
					<div className={styles.groupBtnPopup}>
						<Button p_10_24 grey_2 rounded_8 bold onClick={onClose} maxContent>
							Đóng
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 primary bold rounded_8 onClick={handleSubmit} maxContent>
									Xác nhận
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</Form>
			</div>
		</div>
	);
}

export default PopupWeighReject;
