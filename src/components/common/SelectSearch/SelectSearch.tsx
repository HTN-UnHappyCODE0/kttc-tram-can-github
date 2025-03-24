import React, {memo, useEffect, useRef, useState} from 'react';

import {PropsSelectSearch} from './interfaces';
import styles from './SelectSearch.module.scss';
import clsx from 'clsx';
import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import TippyHeadless from '@tippyjs/react/headless';

function SelectSearch({label, placeholder, options, data, readonly = false, isConvertNumber = false, setData, unit}: PropsSelectSearch) {
	const ref = useRef<any>(null);

	const [width, setWidth] = useState<number>(0);
	const [open, setOpen] = useState<boolean>(false);
	const [keyword, setKeyword] = useState<string>(isConvertNumber ? '0' : '');

	useEffect(() => {
		if (ref.current) {
			const resizeObserver = new ResizeObserver((entries) => {
				if (entries[0].contentRect) {
					setWidth(entries[0].contentRect.width);
				}
			});

			resizeObserver.observe(ref.current);

			return () => {
				resizeObserver.disconnect();
			};
		}
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isConvertNumber) {
			if (!Number(price(e.target.value))) {
				setKeyword('0');
				setData({
					id: '',
					name: 0,
				});
			} else {
				setKeyword(e.target.value);
				setData({
					id: '',
					name: price(e.target.value),
				});
			}
		} else {
			setKeyword(e.target.value);
			setData({
				id: '',
				name: e.target.value,
			});
		}
	};

	return (
		<div className={styles.container}>
			<label className={styles.label}>{label}</label>
			<TippyHeadless
				maxWidth={'100%'}
				interactive
				visible={
					open &&
					options?.filter((v) =>
						removeVietnameseTones(v.name)?.includes(
							keyword ? removeVietnameseTones(isConvertNumber ? String(price(keyword)) : keyword) : ''
						)
					)?.length > 0
				}
				onClickOutside={() => setOpen(false)}
				placement='bottom-start'
				render={(attrs: any) => (
					<div style={{width: width}} className={clsx(styles.main_option)}>
						{options
							?.filter((v) =>
								removeVietnameseTones(v.name)?.includes(
									keyword ? removeVietnameseTones(isConvertNumber ? String(price(keyword)) : keyword) : ''
								)
							)
							?.map((v) => (
								<div
									key={v.id}
									className={clsx(styles.item, {[styles.active]: v.id == data.id})}
									onClick={() => {
										setData({
											id: v?.id,
											name: isConvertNumber ? price(Number(v?.name)) : v?.name,
										});
										setOpen(false);
										setKeyword(isConvertNumber ? convertCoin(Number(v?.name)) : v?.name);
									}}
								>
									{isConvertNumber ? convertCoin(Number(v.name)) : v.name}
								</div>
							))}
					</div>
				)}
			>
				<div className={styles.box_input} ref={ref}>
					<input
						type='text'
						className={clsx(styles.input, {[styles.readonly]: readonly})}
						placeholder={placeholder || 'Tìm kiếm...'}
						name='keyword'
						value={isConvertNumber ? convertCoin(price(data.name)) : data.name || keyword}
						autoComplete='off'
						readOnly={readonly}
						onFocus={() => {
							if (readonly) {
								return;
							} else {
								setOpen(true);
							}
						}}
						onChange={handleChange}
					/>

					{!!unit && <div className={styles.unit}>{unit}</div>}
				</div>
			</TippyHeadless>
		</div>
	);
}

export default memo(SelectSearch);
