import clsx from 'clsx';
import Image from 'next/image';
import {GrSearch} from 'react-icons/gr';
import {IoClose} from 'react-icons/io5';
import {IoMdAddCircle} from 'react-icons/io';
import React, {Fragment, useEffect, useMemo, useState} from 'react';

import Popup from '../Popup';
import Button from '../Button';
import icons from '~/constants/images/icons';
import {removeVietnameseTones} from '~/common/funcs/optionConvert';

import {PropsButtonSelectMany} from './interfaces';
import styles from './ButtonSelectMany.module.scss';

function ButtonSelectMany({
	label,
	placeholder,
	title,
	description,
	showOverlay = true,
	isShowCode = true,
	readonly = false,
	listDataDisable = [],
	dataList = [],
	dataChecked,
	setDataChecked,
	isShowCheckAll = true,
}: PropsButtonSelectMany) {
	const [open, setOpen] = useState<boolean>(false);
	const [keyword, setKeyword] = useState<string>('');

	const [listChecked, setListChecked] = useState<
		{
			uuid: string;
			name: string;
			code?: string;
		}[]
	>([]);

	useEffect(() => {
		setListChecked(dataChecked);
	}, [dataChecked]);

	const handleCheckItem = (uuid: string) => {
		const item = dataList?.find((v) => v?.uuid == uuid);

		if (listChecked?.find((v) => v.uuid == uuid)) {
			setListChecked(listChecked?.filter((x) => x.uuid != uuid));
		} else {
			setListChecked((prev: any) => [...prev, item]);
		}
	};

	const handleCheckAll = (e: any) => {
		const {checked} = e?.target;

		if (checked) {
			setListChecked(dataList);
		} else {
			setListChecked([]);
		}
	};

	const handleDeleteItem = (uuid: string) => {
		setDataChecked(dataChecked.filter((v) => v.uuid != uuid));
	};

	const handleSubmit = () => {
		setDataChecked(listChecked);
		setOpen(false);
	};

	const filteredArray = useMemo(() => {
		if (!!listDataDisable) {
			return dataChecked.filter((a) => !listDataDisable.some((b) => b.uuid === a.uuid));
		}
	}, [dataChecked, listDataDisable]);

	return (
		<Fragment>
			<div className={styles.container}>
				<p className={styles.label}>{label && label}</p>
				<div
					className={clsx(styles.select_customers, {[styles.readonly]: readonly})}
					onClick={() => {
						if (readonly) {
							return;
						} else {
							setOpen(true);
						}
					}}
				>
					<p className={clsx(styles.text, {[styles.placeholder]: dataChecked.length == 0})}>
						{dataChecked?.length > 0 ? dataChecked.length : placeholder}
					</p>
					{!readonly ? (
						<div className={styles.icon_add}>
							<IoMdAddCircle size={20} color='#3772FF' />
						</div>
					) : null}
				</div>

				<div className={clsx(styles.list_customers, {[styles.mt]: dataChecked?.length > 0})}>
					{dataChecked?.map((v, i) => (
						<div key={i} className={styles.customer}>
							<p>
								{v?.name} {v?.code && isShowCode ? <span> - {v.code}</span> : null}
							</p>
							{!readonly && filteredArray?.some((x) => x?.uuid == v?.uuid) ? (
								<div className={styles.delete_customer} onClick={() => handleDeleteItem(v.uuid)}>
									<IoClose size={16} color='#23262F' />
								</div>
							) : null}
						</div>
					))}
				</div>
			</div>

			{/* POPUP */}
			<Popup showOverlay={showOverlay} open={open} onClose={() => setOpen(false)}>
				<div className={styles.mainPopup}>
					<h4 className={styles.title}>{title}</h4>
					<p className={styles.des}>{description}</p>
					<div className={clsx(styles.input)}>
						<div className={styles.icon}>
							<GrSearch color='#3f4752' size={16} />
						</div>
						<input
							value={keyword}
							type='text'
							name='keyword'
							placeholder='Tìm kiếm tên hoặc mã'
							onChange={(e) => setKeyword(e.target.value)}
							autoComplete='off'
						/>
					</div>
					<div className={clsx(styles.select_all, {[styles.isShowCheckAll]: !isShowCheckAll})}>
						{isShowCheckAll ? (
							<div className={clsx(styles.option, styles.notBorder)}>
								<input
									id='check_all'
									type='checkbox'
									className={styles.checkbox}
									onChange={handleCheckAll}
									checked={listChecked.length == dataList.length}
								/>
								<label htmlFor='check_all' className={styles.label_check_all}>
									Chọn tất cả
								</label>
							</div>
						) : (
							<div></div>
						)}
						<p className={styles.selected}>
							Đã chọn: <span>{listChecked.length}</span>
						</p>
					</div>

					<div className={styles.list}>
						{dataList?.filter(
							(v) =>
								removeVietnameseTones(v.name)?.includes(keyword ? removeVietnameseTones(keyword) : '') ||
								removeVietnameseTones(v.code!)?.includes(keyword ? removeVietnameseTones(keyword) : '')
						)?.length > 0 ? (
							<>
								{dataList
									?.filter(
										(v) =>
											removeVietnameseTones(v.name)?.includes(keyword ? removeVietnameseTones(keyword) : '') ||
											removeVietnameseTones(v.code!)?.includes(keyword ? removeVietnameseTones(keyword) : '')
									)

									?.map((v, i) => (
										<div key={i} className={styles.option}>
											<input
												id={`check_item_${i}`}
												type='checkbox'
												className={clsx(styles.checkbox, {
													[styles.disable]: listDataDisable.some((x) => x.uuid == v.uuid),
												})}
												onChange={() => {
													if (listDataDisable.some((x) => x.uuid == v.uuid)) {
														return null;
													} else {
														handleCheckItem(v?.uuid);
													}
												}}
												checked={!!listChecked?.find((item) => v.uuid == item.uuid)}
											/>
											<label
												htmlFor={`check_item_${i}`}
												className={clsx(styles.label_check_item, {
													[styles.disable]: listDataDisable.some((x) => x.uuid == v.uuid),
												})}
											>
												{v?.name} {v?.code && isShowCode ? <span> - {v.code}</span> : null}
											</label>
										</div>
									))}
							</>
						) : (
							<div className={styles.empty}>
								<Image alt='icon empty' src={icons.iconEmpty} width={100} height={100} />
								<p>Dữ liệu đang trống! thêm dữ liệu ngay . . .</p>
							</div>
						)}
					</div>
					<div className={styles.control}>
						<div>
							<Button p_8_24 rounded_2 grey_outline onClick={() => setOpen(false)}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<Button disable={listChecked?.length == 0} p_8_24 rounded_2 primary onClick={handleSubmit}>
								Đồng ý
							</Button>
						</div>
					</div>

					<div className={styles.icon_close} onClick={() => setOpen(false)}>
						<IoClose size={24} color='#23262F' />
					</div>
				</div>
			</Popup>
		</Fragment>
	);
}

export default ButtonSelectMany;
