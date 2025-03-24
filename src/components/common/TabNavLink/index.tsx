import {PropsTabNavLink} from './interface';
import clsx from 'clsx';
import styles from './TabNavLink.module.scss';
import {useRouter} from 'next/router';

function TabNavLink({listHref, query, listKeyRemove = []}: PropsTabNavLink) {
	const router = useRouter();

	const handleActive = (value: string | null) => {
		const newQuery = Object.fromEntries(Object.entries(router.query).filter(([key]) => !listKeyRemove.includes(key)));

		if (value == null) {
			const {[query]: str, ...rest} = newQuery;
			return router.replace(
				{
					query: {
						...rest,
					},
				},
				undefined,
				{
					scroll: false,
				}
			);
		}

		return router.replace(
			{
				query: {
					...newQuery,
					[query]: value,
				},
			},
			undefined,
			{
				scroll: false,
			}
		);
	};

	return (
		<div className={clsx(styles.container)}>
			{listHref.map((item, i, arr) => (
				<div
					className={clsx(styles.item, {
						[styles.active]: router.query[`${query}`]
							? router.query[`${query}`] === item.query
							: !item.query || item.query == arr[0].query,
					})}
					key={i}
					onClick={() => handleActive(item.query)}
				>
					{item.title}
				</div>
			))}
		</div>
	);
}

export default TabNavLink;
