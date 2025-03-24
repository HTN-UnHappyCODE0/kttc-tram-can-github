import {PropsBaseLayout, TContextBaseLayout} from './interfaces';
import {createContext, useState} from 'react';

import Header from './components/Header';
import MenuTab from './components/MenuTab';
import RequireAuth from '~/components/protected/RequiredAuth';
import clsx from 'clsx';
import styles from './BaseLayout.module.scss';

export const ContextBaseLayout = createContext<TContextBaseLayout>({});

function BaseLayout({children, title, bgLight = false}: PropsBaseLayout) {
	const [showFull, setShowFull] = useState(true);

	return (
		<RequireAuth>
			<ContextBaseLayout.Provider value={{showFull, setShowFull}}>
				<div className={clsx(styles.container, {[styles.hidden]: !showFull, [styles.bgLight]: bgLight})}>
					<div className={styles.header}>
						<Header title={title} />
					</div>
					<div className={clsx(styles.tab)}>
						<MenuTab />
					</div>
					<div className={styles.main}>{children}</div>
				</div>
			</ContextBaseLayout.Provider>
		</RequireAuth>
	);
}

export default BaseLayout;
