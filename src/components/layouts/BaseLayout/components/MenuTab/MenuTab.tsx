import {RootState} from '~/redux/store';
import {useCallback, useContext} from 'react';

import {ContextBaseLayout} from '../../BaseLayout';
import ImageFill from '~/components/common/ImageFill';
import Link from 'next/link';
import {Menu, PATH} from '~/constants/config';
import {PropsMenuTab} from './interfaces';
import {TContextBaseLayout} from '../../interfaces';
import clsx from 'clsx';
import icons from '~/constants/images/icons';
import styles from './MenuTab.module.scss';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';

function MenuTab({}: PropsMenuTab) {
	const router = useRouter();

	const {isMobile} = useSelector((state: RootState) => state.site);
	const context = useContext<TContextBaseLayout>(ContextBaseLayout);

	const checkActive = useCallback(
		(pathname: string) => {
			const currentRoute = router.pathname.split('/')[1];

			return pathname == `/${currentRoute}`;
		},
		[router]
	);

	return (
		<div id='menuTab' className={styles.container}>
			<div
				className={clsx(styles.header, {
					[styles.header_small]: !context.showFull,
				})}
			>
				<Link href={PATH.Home} className={styles.left}>
					<ImageFill src={icons.logo} className={styles.logo_icon} alt='Logo' />
					{context?.showFull && <h4 className={styles.title_logo}>Quản trị kế toán</h4>}
				</Link>
			</div>
			<div
				className={clsx(styles.menu, {
					[styles.menu_small]: !context.showFull,
				})}
			>
				{Menu.map((v, i) => (
					<div className={styles.group} key={i}>
						<div className={styles.groupTitle}>{v.title}</div>
						<div className={styles.menuGroup}>
							{v.group.map((item, j) => (
								<Link
									onClick={(e) => {
										isMobile && context?.setShowFull!(!context?.showFull);

										if (checkActive(item.path) || checkActive(item.pathActive!)) {
											e.preventDefault();
										}
									}}
									href={item.path}
									className={clsx(styles.itemGroup, {
										[styles.active]: checkActive(item.path) || checkActive(item.pathActive!),
										[styles.small]: !context?.showFull,
									})}
									key={j}
								>
									<i>
										<ImageFill style_1_1='true' src={item.icon} />
									</i>
									{context?.showFull ? <p className={styles.item_text}>{item.title}</p> : null}
								</Link>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default MenuTab;
