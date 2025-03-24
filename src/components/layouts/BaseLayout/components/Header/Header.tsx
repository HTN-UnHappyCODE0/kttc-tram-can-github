import {ContextBaseLayout} from '../../BaseLayout';
import {PropsHeader} from './interfaces';
import TippyHeadless from '@tippyjs/react/headless';

import {TContextBaseLayout} from '../../interfaces';
import styles from './Header.module.scss';
import {useContext, useState} from 'react';
import ImageFill from '~/components/common/ImageFill';
import clsx from 'clsx';
import icons from '~/constants/images/icons';
import Avatar from '~/components/common/Avatar';
import BoxMenuProfile from '../BoxMenuProfile';
import BoxNoti from '../BoxNoti';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';

function Header({title}: PropsHeader) {
	const context = useContext<TContextBaseLayout>(ContextBaseLayout);
	const {infoUser} = useSelector((state: RootState) => state.user);

	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [openNoti, setOpenNoti] = useState<boolean>(false);

	return (
		<div className={styles.container}>
			<div className={styles.left}>
				<div className={styles.groupArrows}>
					<div
						className={clsx(styles.arrow, {
							[styles.active]: !context?.showFull,
						})}
						onClick={() => context?.setShowFull!(!context?.showFull)}
					>
						<ImageFill src={icons.iconHamburger} className={styles.iconHamburger} />
					</div>
					<h4 className={styles.title}>{title}</h4>
				</div>
			</div>

			<div className={styles.right}>
				<TippyHeadless
					maxWidth={'100%'}
					interactive
					visible={openNoti}
					onClickOutside={() => setOpenNoti(false)}
					placement='bottom'
					render={(attrs: any) => <BoxNoti />}
				>
					<div className={styles.icon_bell} onClick={() => setOpenNoti(!openNoti)}>
						<ImageFill style_1_1='true' src={icons.bell} />
					</div>
				</TippyHeadless>
				<TippyHeadless
					maxWidth={'100%'}
					interactive
					visible={openMenu}
					onClickOutside={() => setOpenMenu(false)}
					placement='bottom-end'
					render={(attrs: any) => <BoxMenuProfile onCLose={() => setOpenMenu(false)} />}
				>
					<div className={styles.info} onClick={() => setOpenMenu(!openMenu)}>
						<p className={styles.name}>{infoUser?.fullname || infoUser?.userName}</p>
						<Avatar
							src={infoUser?.avatar ? `${process.env.NEXT_PUBLIC_IMAGE}/${infoUser?.avatar}` : ''}
							className={styles.avatar}
						/>
					</div>
				</TippyHeadless>
			</div>
		</div>
	);
}

export default Header;
