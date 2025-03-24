import React, {useState} from 'react';

import {PropsFormDeleteTransaction} from './interfaces';
import styles from './FormDeleteTransaction.module.scss';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import transactionServices from '~/services/transactionServices';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import {clsx} from 'clsx';
import {IoHelpCircleOutline} from 'react-icons/io5';
import Form, {FormContext} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import Button from '~/components/common/Button';

function FormDeleteTransaction({uuid, onClose}: PropsFormDeleteTransaction) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{description: string}>({
		description: '',
	});
	const funcChangeStatusTransaction = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Hủy phiếu thanh toán thành công!',
				http: transactionServices.changeStatus({
					uuid: uuid!,
					description: form.description,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_lich_su_thanh_toan]);
			}
		},
	});

	const handleSubmit = () => {
		return funcChangeStatusTransaction.mutate();
	};

	return (
		<div className={clsx(styles.popup)}>
			<Loading loading={funcChangeStatusTransaction.isLoading} />
			<div className={styles.iconWarn}>
				<IoHelpCircleOutline />
			</div>

			<p className={styles.note}>Bạn chắc chắn muốn hủy phiếu thanh toán này?</p>
			<div className={clsx('mt')}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<TextArea isRequired name='description' max={5000} blur placeholder='Nhập lý do hủy' />
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

export default FormDeleteTransaction;
