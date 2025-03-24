import {PropsTabNavPage} from './interface';
import clsx from 'clsx';
import styles from './TabNavPage.module.scss';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useCallback} from 'react';

function TabNavPage({listPages}: PropsTabNavPage) {
	const router = useRouter();

	const checkActive = useCallback(
		(pathname: string) => {
			const path = pathname?.split('?')?.[0];

			const currentRoute = router.pathname;
			return path == `${currentRoute}`;
		},
		[router]
	);

	return (
		<div className={clsx(styles.container)}>
			{listPages.map((item, i) => (
				<Link
					onClick={(e) => {
						if (checkActive(item.url)) {
							e.preventDefault();
						}
					}}
					href={item.url}
					className={clsx(styles.item, {
						[styles.active]: checkActive(item.url),
					})}
					key={i}
				>
					{item.title}
				</Link>
			))}
		</div>
	);
}

export default TabNavPage;
