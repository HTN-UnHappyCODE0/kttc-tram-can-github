import {memo, useEffect, useState} from 'react';
import Calendar from './components/Calendar';
import HeadlessTippy from '@tippyjs/react/headless';
import {PropsDatePicker2} from './interface';
import clsx from 'clsx';
import styles from './DatePicker2.module.scss';
import convertDate from '~/common/funcs/convertDate';
import {CalendarSearch} from 'iconsax-react';
import {RiCloseCircleFill} from 'react-icons/ri';

function DatePicker2({
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
}: PropsDatePicker2) {
	const [show, setShow] = useState<boolean>(false);
	const [isFocus, setIsFocus] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>(value ? convertDate(value).getDateFormat() || '' : '');

	useEffect(() => {
		setInputValue(value ? convertDate(value).getDateFormat() || '' : '');
	}, [value]);

	const handleClickDay = (time: number) => {
		setIsFocus(false);
		setShow(false);
		const date = new Date(time);
		onSetValue(date);
		setInputValue(convertDate(date).getDateFormat() || '');
	};

	const handleClean = (e: any) => {
		e.stopPropagation();
		onSetValue(null);
		setInputValue('');
	};

	const formatDateInput = (value: string) => {
		const cleanValue = value.replace(/\D/g, '');

		let day = cleanValue.slice(0, 2);
		let month = cleanValue.slice(2, 4);
		const year = cleanValue.slice(4, 8);

		// Điều chỉnh số ngày cho các tháng
		if (day.length === 2 && Number(day) > 31) {
			day = '0' + day[0];
			month = day[1] + month;
		}

		if (day.length === 2 && Number(day) < 1) {
			day = '01';
		}

		if (month.length === 2 && Number(month) < 1) {
			month = '01';
		}

		if (month.length === 2 && Number(month) > 12) {
			month = '0' + month[0];
		}

		// month 2
		if (month === '02' && year.length === 4) {
			const isLeapYear = (Number(year) % 4 === 0 && Number(year) % 100 !== 0) || Number(year) % 400 === 0;

			if (isLeapYear && Number(day) > 29) {
				day = '29';
			} else if (!isLeapYear && Number(day) > 28) {
				day = '28';
			}
		}

		let formattedValue = day;
		if (month) formattedValue += '/' + month;
		if (year) formattedValue += '/' + year;

		return formattedValue;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;

		const formattedInput = formatDateInput(input);

		setInputValue(formattedInput);

		const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
		if (regex.test(formattedInput)) {
			const [day, month, year] = formattedInput.split('/').map(Number);
			const date = new Date(year, month - 1, day);

			if (!isNaN(date.getTime())) {
				onSetValue(date);
			}
		}
	};

	const handlerBlur = () => {
		setIsFocus(false);
	};

	return (
		<div className={styles.container}>
			{label && <p className={styles.label}>{label}</p>}

			<div
				className={clsx(styles.calendar, className, {
					[styles.placeholder]: !value,
					[styles.focus]: isFocus || show,
					[styles.readonly]: readonly,
				})}
			>
				<input
					type='text'
					onBlur={handlerBlur}
					value={inputValue}
					onChange={handleInputChange}
					placeholder={placeholder}
					readOnly={readonly}
					className={clsx(styles.input)}
					maxLength={10}
					onFocus={() => setIsFocus(true)}
					onClick={() => {
						if (!readonly) {
							setIsFocus(true);
						}
					}}
				/>
				<HeadlessTippy
					interactive
					visible={show}
					placement='bottom'
					render={(attrs) => (
						<Calendar onClickDay={handleClickDay} show={show} blockOldDay={blockOldDay} futureDayblock={futureDayblock} />
					)}
					onClickOutside={() => setShow(false)}
				>
					<div>
						<div
							onClick={() => {
								if (!readonly) {
									setShow(!show);
								}
							}}
						>
							{/* Hiển thị biểu tượng tùy thuộc vào trạng thái focus */}
							{/* {isFocus && !!inputValue ? (
								<div className={clsx(styles.icon)} onClick={handleClean}>
									<RiCloseCircleFill size={24} />
								</div>
							) : (
								icon &&
								!inputValue && (
									<div className={styles.icon}>
										<CalendarSearch size={24} />
									</div>
								)
							)} */}

							<div className={styles.icon_container}>
								<div className={styles.icon}>
									<CalendarSearch size={24} />
								</div>
								<div className={clsx(styles.icon)} onClick={handleClean}>
									<RiCloseCircleFill size={24} />
								</div>
							</div>

							{/* {onClean && isFocus && (
								<div className={clsx(styles.icon)} onClick={handleClean}>
									<RiCloseCircleFill size={24} />
								</div>
							)} */}
						</div>
					</div>
				</HeadlessTippy>
			</div>
		</div>
	);
}

export default memo(DatePicker2);
