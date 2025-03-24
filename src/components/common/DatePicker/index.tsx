import {memo, useState} from 'react';

import Calendar from './components/Calendar';
import HeadlessTippy from '@tippyjs/react/headless';
import {PropsDatePicker} from './interface';
import clsx from 'clsx';
import styles from './DatePicker.module.scss';
import convertDate from '~/common/funcs/convertDate';
import {FaRegCalendarCheck} from 'react-icons/fa';
import {RiCloseCircleFill} from 'react-icons/ri';

function DatePicker({
	placeholder,
	label,
	onSetValue,
	onClean,
	value,
	icon,
	className,
	blockOldDay,
	futureDayblock,
	readOnly = false,
}: PropsDatePicker) {
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
						[styles.readOnly]: readOnly,
					})}
					onClick={() => !readOnly && setShow(!show)}
				>
					{icon && (
						<div className={styles.icon}>
							<FaRegCalendarCheck size={18} />
						</div>
					)}
					<div className={styles.value}>{value ? convertDate(value).getDateFormat() : placeholder}</div>

					{onClean && !!value && !readOnly && (
						<div className={clsx(styles.clean, styles.icon)} onClick={handleClean}>
							<RiCloseCircleFill color='#29303c' />
						</div>
					)}
				</div>
			</div>
		</HeadlessTippy>
	);
}

export default memo(DatePicker);
