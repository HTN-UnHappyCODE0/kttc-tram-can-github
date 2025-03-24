import {memo, useState} from 'react';

import Calendar from './components/Calendar';
import HeadlessTippy from '@tippyjs/react/headless';
import {PropsDatePickerFilter} from './interface';
import clsx from 'clsx';
import styles from './DatePickerFilter.module.scss';
import convertDate from '~/common/funcs/convertDate';
import {FaRegCalendarCheck} from 'react-icons/fa';
import {RiCloseCircleFill} from 'react-icons/ri';
import {ArrowDown2} from 'iconsax-react';

function DatePickerFilter({
	placeholder,
	label,
	onSetValue,
	onClean,
	value,
	icon,
	className,
	blockOldDay,
	futureDayblock,
	readonly,
}: PropsDatePickerFilter) {
	const [show, setShow] = useState<boolean>(false);

	const handleClickDay = (time: number) => {
		setShow(false);
		onSetValue(new Date(time));
		setShow(false);
	};

	const handleClean = (e: any) => {
		e.stopPropagation();
		onSetValue(null);
	};

	return (
		<HeadlessTippy
			interactive
			visible={show}
			placement='bottom'
			render={(attrs) => (
				<Calendar onClickDay={handleClickDay} show={show} blockOldDay={blockOldDay} futureDayblock={futureDayblock} />
			)}
			onClickOutside={() => setShow(false)}
		>
			<div className={styles.container}>
				{label && <p className={styles.label}>{label}</p>}

				<div
					className={clsx(styles.calendar, className, {
						[styles.placeholder]: !value,
						[styles.focus]: show,
						[styles.readonly]: readonly,
					})}
					onClick={() => {
						if (readonly) {
							return null;
						} else {
							setShow(!show);
						}
					}}
				>
					{icon && (
						<div className={styles.icon}>
							<FaRegCalendarCheck size={18} />
						</div>
					)}
					<div className={styles.value}>{value ? convertDate(value).getDateFormat() : placeholder}</div>

					<div className={styles.clean}>
						{onClean && !!value && (
							<div className={clsx(styles.icon)} onClick={handleClean}>
								<RiCloseCircleFill color='#29303c' />
							</div>
						)}
						<div className={styles.icon_arrow}>
							<ArrowDown2 size={16} />
						</div>
					</div>
				</div>
			</div>
		</HeadlessTippy>
	);
}

export default memo(DatePickerFilter);
