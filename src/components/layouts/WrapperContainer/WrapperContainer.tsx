import {PropsWrapperContainer} from './interfaces';
import React from 'react';
import clsx from 'clsx';
import styles from './WrapperContainer.module.scss';

function WrapperContainer({children, bg = false}: PropsWrapperContainer) {
	return (
		<div
			className={clsx(styles.container, {
				[styles.bg]: bg,
			})}
		>
			{children}
		</div>
	);
}

export default WrapperContainer;
