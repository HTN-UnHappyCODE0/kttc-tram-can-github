import React, {useState} from 'react';
import {PropsPopupDeleteCustomer} from './interfaces';
import styles from './PopupDeleteCustomer.module.scss';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import Form, {FormContext} from '~/components/common/Form';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import TextArea from '~/components/common/Form/components/TextArea';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import {IoHelpCircleOutline} from 'react-icons/io5';
import customerServices from '~/services/customerServices';

function PopupDeleteCustomer({uuid, onClose}: PropsPopupDeleteCustomer) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{description: string}>({
		description: '',
	});

	const funcDeleteCustomer = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa khách hàng thành công',
				http: customerServices.deleteCustomer({
					uuid: uuid!,
					description: form.description,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_khach_hang_doi_tac]);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_nha_cung_cap]);
			}
		},
	});

	const handleSubmit = () => {
		return funcDeleteCustomer.mutate();
	};

	return (
		<div className={clsx('effectZoom', styles.popup)}>
			<Loading loading={funcDeleteCustomer.isLoading} />
			<div className={styles.iconWarn}>
				<IoHelpCircleOutline />
			</div>

			<p className={styles.note}>Bạn chắc chắn muốn khách hàng này?</p>
			<div className={clsx('mt')}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<TextArea isRequired name='description' max={5000} blur placeholder='Nhập lý do xóa' />
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

export default PopupDeleteCustomer;
