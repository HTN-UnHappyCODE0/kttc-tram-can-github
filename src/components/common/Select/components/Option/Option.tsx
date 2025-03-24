import {useContext, useEffect} from 'react';

import {ContextSelect} from '../../Select';
import {PropsOption} from '../../interfaces';
import clsx from 'clsx';
import styles from './Option.module.scss';
import {removeVietnameseTones} from '~/common/funcs/optionConvert';

function Option({value, title, onClick}: PropsOption) {
	const stateContext = useContext<{
		onChange: (value: any) => void;
		data: any;
		keyword: string;
		defaultValue?: any;
	}>(ContextSelect);

	useEffect(() => {
		if (stateContext.defaultValue == value) {
			stateContext.onChange({value, title});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateContext.defaultValue]);

	const handleChange = () => {
		stateContext.onChange({value, title});
		if (onClick) {
			onClick();
		}
	};

	return (
		<div
			hidden={!removeVietnameseTones(title)?.includes(removeVietnameseTones(stateContext?.keyword))}
			className={clsx(styles.container, {
				[styles.active]: stateContext?.data?.value == value,
			})}
			onClick={handleChange}
		>
			{title}
		</div>
	);
}

export default Option;
