import React from 'react';

import {PropsFlexLayout} from './interfaces';
import styles from './FlexLayout.module.scss';
import clsx from 'clsx';

function FlexLayout({isPage = true, children}: PropsFlexLayout) {
	return <div className={clsx(styles.container, {[styles.isPage]: isPage})}>{children}</div>;
}

export default FlexLayout;
