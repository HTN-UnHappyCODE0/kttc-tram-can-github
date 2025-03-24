import React from 'react';

import {PropsIconCustom} from './interfaces';
import styles from './IconCustom.module.scss';
import Tippy from '@tippyjs/react';
import {useStyleClass} from '~/common/hooks/usStyleClass';
import clsx from 'clsx';
import Link from 'next/link';

function IconCustom({icon, tooltip, onClick, color, href, ...props}: PropsIconCustom) {
	const styleClass = useStyleClass(props, styles);

	return (
		<Tippy content={tooltip}>
			{href ? (
				<Link href={href} style={{color: color}} className={clsx(styleClass, styles.container)} onClick={onClick}>
					<i>{icon}</i>
				</Link>
			) : (
				<div style={{color: color}} className={clsx(styleClass, styles.container)} onClick={onClick}>
					<i>{icon}</i>
				</div>
			)}
		</Tippy>
	);
}

export default IconCustom;
