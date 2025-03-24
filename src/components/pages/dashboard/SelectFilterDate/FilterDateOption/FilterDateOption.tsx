import React from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import {PropsFilterDateOption} from './interfaces';

import styles from './FilterDateOption.module.scss';
import clsx from 'clsx';
import {ListOptionTimePicker} from '~/constants/config';
import {TYPE_DATE} from '~/constants/config/enum';
import RangeDatePicker from '~/components/common/RangeDatePicker';
import {getDateRange} from '~/common/funcs/selectDate';

function FilterDateOption({date, setDate, typeDate, setTypeDate, show, setShow, isOptionDateAll}: PropsFilterDateOption) {
	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={Number(typeDate) == TYPE_DATE.LUA_CHON}
			placement='right-start'
			render={(attrs) => (
				<div className={styles.main_calender}>
					<RangeDatePicker
						value={date}
						onSetValue={setDate}
						onClose={() => setShow(false)}
						open={show && Number(typeDate) == TYPE_DATE.LUA_CHON}
					/>
				</div>
			)}
		>
			<div className={styles.mainOption}>
				{isOptionDateAll && (
					<div
						className={clsx(styles.option, {
							[styles.option_active]: typeDate == null,
						})}
						onClick={() => {
							setShow(false);
							setTypeDate(null);
							setDate(null);
						}}
					>
						<p>{'Tất cả'}</p>
					</div>
				)}
				{ListOptionTimePicker.map((v, i) => (
					<div
						key={i}
						className={clsx(styles.option, {
							[styles.option_active]: Number(typeDate) == v.value,
						})}
						onClick={() => {
							if (v.value != TYPE_DATE.LUA_CHON) {
								setDate(getDateRange(v.value));
								setShow(false);
							}
							setTypeDate(v.value);
						}}
					>
						<p>{v.name}</p>
					</div>
				))}
			</div>
		</TippyHeadless>
	);
}

export default FilterDateOption;
