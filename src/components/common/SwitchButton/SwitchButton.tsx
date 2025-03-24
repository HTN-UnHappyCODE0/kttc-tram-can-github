import {useEffect, useState} from 'react';

import clsx from 'clsx';
import styles from './SwitchButton.module.scss';

function SwitchButton({onChange, value, name}: any) {
	const [checked, setChecked] = useState<boolean>(value);

	useEffect(() => {
		setChecked(value);
	}, [value]);

	return (
		<div
			className={clsx([styles.container, 'click', {[styles.checked]: checked}])}
			onClick={() => {
				setChecked(!checked);
				onChange &&
					onChange({
						target: {
							value: !checked,
							name: name ? name : null,
						},
					});
			}}
		></div>
	);
}

export default SwitchButton;
