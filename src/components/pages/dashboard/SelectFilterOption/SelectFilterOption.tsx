import React, {useRef, useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';

import {PropsSelectFilterOption} from './interfaces';
import styles from './SelectFilterOption.module.scss';
import clsx from 'clsx';
import {BiCheck} from 'react-icons/bi';
import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import {ArrowDown2} from 'iconsax-react';

function SelectFilterOption({uuid, setUuid, listData, placeholder, isShowAll = true}: PropsSelectFilterOption) {
	const [keyword, setKeyword] = useState<string>('');
	const [openPartner, setOpenPartner] = useState<boolean>(false);
	const inputSearchRef = useRef<HTMLInputElement>(null);

	const handleSelectClick = () => {
		if (inputSearchRef?.current) {
			setTimeout(() => {
				inputSearchRef.current?.focus();
			}, 0);
		}
	};

	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={openPartner}
			onClickOutside={() => setOpenPartner(false)}
			placement='bottom-start'
			render={() => (
				<div className={styles.main_option}>
					<input
						ref={inputSearchRef}
						placeholder='Tìm kiếm...'
						className={styles.inputSearch}
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
					/>
					<div className={styles.overflow}>
						{isShowAll && (
							<div
								className={clsx(styles.option, {
									[styles.option_active]: uuid == '',
								})}
								onClick={() => {
									setOpenPartner(false);
									setUuid('');
								}}
							>
								<p>{'Tất cả'}</p>
								{uuid == '' && (
									<div className={styles.icon_check}>
										<BiCheck fontSize={18} color='#5755FF' fontWeight={600} />
									</div>
								)}
							</div>
						)}
						{listData
							?.filter((v: any) => removeVietnameseTones(v.name)?.includes(keyword ? removeVietnameseTones(keyword) : ''))
							?.map((v: any) => (
								<div
									key={v?.uuid}
									className={clsx(styles.option, {
										[styles.option_active]: uuid == v.uuid,
									})}
									onClick={() => {
										setOpenPartner(false);
										setUuid(v?.uuid);
									}}
								>
									<p>{v.name}</p>
									{uuid == v.uuid && (
										<div className={styles.icon_check}>
											<BiCheck fontSize={20} fontWeight={600} />
										</div>
									)}
								</div>
							))}
					</div>
				</div>
			)}
		>
			<div
				className={clsx(styles.btn_filter, {[styles.active]: openPartner})}
				onClick={() => {
					setOpenPartner(!openPartner);
					handleSelectClick();
				}}
			>
				<p>{uuid == '' ? placeholder : listData?.find((v: any) => v?.uuid == uuid)?.name}</p>
				<div className={styles.arrow}>
					<ArrowDown2 size={16} />
				</div>
			</div>
		</TippyHeadless>
	);
}

export default SelectFilterOption;
