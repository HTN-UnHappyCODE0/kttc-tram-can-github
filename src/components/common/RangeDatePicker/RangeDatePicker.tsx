import {createContext, memo, useCallback, useEffect, useState} from 'react';

import CalendarMain from './components/CalendarMain';
import {PropsRangeDatePicker} from './interfaces';
import clsx from 'clsx';
import styles from './RangeDatePicker.module.scss';
import {ArrowLeft2, ArrowRight, ArrowRight2} from 'iconsax-react';
import Button from '../Button';
import convertDate from '~/common/funcs/convertDate';

const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const ContextCalendar = createContext<any>(null);

function RangeDatePicker({onClose, onSetValue, value, open, onSubmit}: PropsRangeDatePicker) {
	const [typeCalendarLeft, setTypeCalendarLeft] = useState(0);
	const [typeCalendarRight, setTypeCalendarRight] = useState(0);
	const [dateLeft, setDateLeft] = useState(new Date());
	const [dateRight, setDateRight] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1));

	const [dateHover, setDateHover] = useState<Date | null>(null);
	const [yearTableLeft, setYearTableLeft] = useState<any>();
	const [yearTableRight, setYearTableRight] = useState<any>();
	const [datePicker, setDatePicker] = useState<{
		to: Date | null;
		from: Date | null;
	}>({
		from: null,
		to: null,
	});

	const handleNext = useCallback(
		(isCalendarRight?: boolean) => {
			if (isCalendarRight) {
				if (typeCalendarRight == 0)
					setDateRight((prevDate) => {
						const month = prevDate.getMonth() + 1;
						const year = prevDate.getFullYear();
						const newDate = new Date(year, month);
						return newDate;
					});
			} else {
				if (typeCalendarLeft == 0)
					setDateLeft((prevDate) => {
						const month = prevDate.getMonth() + 1;
						const year = prevDate.getFullYear();
						const newDate = new Date(year, month);
						if (newDate < dateRight) return newDate;
						else return prevDate;
					});
			}
		},
		[dateRight, typeCalendarLeft, typeCalendarRight]
	);

	const handlePrev = useCallback(
		(isCalendarRight?: boolean) => {
			if (isCalendarRight) {
				if (typeCalendarRight == 0)
					setDateRight((prevDate) => {
						const month = prevDate.getMonth() - 1;
						const year = prevDate.getFullYear();
						const newDate = new Date(year, month);
						if (dateLeft < newDate) return newDate;
						else return prevDate;
					});
			} else {
				if (typeCalendarLeft == 0)
					setDateLeft((prevDate) => {
						const month = prevDate.getMonth() - 1;
						const year = prevDate.getFullYear();
						const newDate = new Date(year, month);
						return newDate;
					});
			}
		},
		[dateLeft, typeCalendarLeft, typeCalendarRight]
	);

	const titleMonthYear = (date: Date, type: number, year: any) => {
		if (type == 1) {
			return `${'Năm'} ${date.getFullYear()}`;
		}
		if (type == 2) {
			return `${'Từ'} ${year.first} - ${year.last}`;
		}
		return `${'Tháng'} ${date.getMonth() + 1}, ${date.getFullYear()}`;
	};

	const handleSubmit = useCallback(() => {
		if (datePicker.from && datePicker.to) {
			onSetValue(datePicker);
			onClose();
			onSubmit && onSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [datePicker]);

	const handleChangeType = (setType: (number: number) => void, type: number) => {
		if (type == 0) {
			setType(1);
		}
		if (type == 1) {
			setType(2);
		}
		if (type == 2) {
			setType(0);
		}
	};

	//Cap nhat value neu co
	useEffect(() => {
		if (!open) {
			setDatePicker({
				from: value?.from,
				to: value?.to,
			});
		} else {
			if (!!value?.from && !!value?.to) {
				if (value?.from.getMonth() == value?.to.getMonth() && value?.from.getFullYear() == value?.to.getFullYear()) {
					setDateLeft(new Date(value?.from.getTime()));
					setDateRight(new Date(value?.from.getFullYear(), value?.from.getMonth() + 1));
				} else {
					setDateLeft(new Date(value?.from.getTime()));
					setDateRight(new Date(value?.to.getTime()));
				}
			}
		}
	}, [open, value?.from, value?.to]);

	useEffect(() => {
		setYearTableLeft({
			first: dateLeft.getFullYear() - 5,
			last: dateLeft.getFullYear() + 6,
		});
		setYearTableRight({
			first: dateRight.getFullYear() - 5,
			last: dateRight.getFullYear() + 6,
		});
	}, [dateLeft, dateRight]);

	return (
		<ContextCalendar.Provider
			value={{
				datePicker,
				setDateHover,
				dateHover,
				setDatePicker,
			}}
		>
			<div className={styles.container}>
				<div className={styles.showDate}>
					<span className={clsx(styles.value, {[styles.active]: !!datePicker.from})}>
						{datePicker.from ? `${convertDate(datePicker.from).getDateFormat()}` : 'Ngày bắt đầu'}
					</span>
					<ArrowRight size='24' color='#23262F' />
					<span className={clsx(styles.value, {[styles.active]: !!datePicker.to})}>
						{datePicker.to ? `${convertDate(datePicker.to).getDateFormat()}` : 'Ngày kết thúc'}
					</span>
				</div>

				<div className={styles.groupCalendar}>
					<div className={styles.main}>
						<div className={styles.displayTitle}>
							<div className={clsx('btn', styles.arrow)} onClick={() => handlePrev(false)}>
								<ArrowLeft2 size={20} />
							</div>
							<p onClick={() => handleChangeType(setTypeCalendarLeft, typeCalendarLeft)}>
								{titleMonthYear(dateLeft, typeCalendarLeft, yearTableLeft)}
							</p>
							<div
								className={clsx('btn', styles.arrow, {
									[styles.disable]:
										dateLeft.getFullYear() == dateRight.getFullYear() &&
										dateLeft.getMonth() + 1 == dateRight.getMonth(),
								})}
								onClick={() => handleNext(false)}
							>
								<ArrowRight2 size={20} />
							</div>
						</div>
						{typeCalendarLeft == 0 ? (
							<div className={styles.rows}>
								{daysOfWeek.map((day, i) => (
									<div className={styles.day} key={i}>
										{day}
									</div>
								))}
							</div>
						) : null}
						<CalendarMain
							date={dateLeft}
							setDate={setDateLeft}
							setType={setTypeCalendarLeft}
							type={typeCalendarLeft}
							year={yearTableLeft}
						/>
					</div>
					<div className={styles.main}>
						<div className={styles.displayTitle}>
							<div
								className={clsx('btn', styles.arrow, {
									[styles.disable]:
										dateLeft.getFullYear() == dateRight.getFullYear() &&
										dateLeft.getMonth() + 1 == dateRight.getMonth(),
								})}
								onClick={() => handlePrev(true)}
							>
								<ArrowLeft2 size={20} />
							</div>
							<p onClick={() => handleChangeType(setTypeCalendarRight, typeCalendarRight)}>
								{titleMonthYear(dateRight, typeCalendarRight, yearTableRight)}
							</p>
							<div className={clsx('btn', styles.arrow)} onClick={() => handleNext(true)}>
								<ArrowRight2 size={20} />
							</div>
						</div>
						{typeCalendarRight == 0 ? (
							<div className={styles.rows}>
								{daysOfWeek.map((day, i) => (
									<div className={styles.day} key={i}>
										{day}
									</div>
								))}
							</div>
						) : null}
						<CalendarMain
							date={dateRight}
							setDate={setDateRight}
							setType={setTypeCalendarRight}
							type={typeCalendarRight}
							year={yearTableRight}
						/>
					</div>
				</div>

				<div className={styles.groupBtn}>
					<Button p_8_24 grey_outline bold rounded_6 onClick={onClose}>
						Hủy bỏ
					</Button>
					<Button p_8_24 primary bold rounded_6 onClick={handleSubmit} disable={!datePicker.from || !datePicker.to}>
						Áp dụng
					</Button>
				</div>
			</div>
		</ContextCalendar.Provider>
	);
}

export default memo(RangeDatePicker);
