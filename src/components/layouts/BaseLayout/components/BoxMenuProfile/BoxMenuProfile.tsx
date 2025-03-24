import React, {Fragment, useCallback, useState} from 'react';

import {PropsBoxMenuProfile} from './interfaces';
import styles from './BoxMenuProfile.module.scss';
import {Logout, UserOctagon} from 'iconsax-react';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';
import clsx from 'clsx';
import Dialog from '~/components/common/Dialog';
import {store} from '~/redux/store';
import {logout} from '~/redux/reducer/auth';
import {setInfoUser} from '~/redux/reducer/user';

function BoxMenuProfile({onCLose}: PropsBoxMenuProfile) {
	const router = useRouter();

	const [openLogout, setOpenLogout] = useState<boolean>(false);

	const checkActive = useCallback(
		(pathname: string) => {
			const currentRoute = router.pathname.split('/')[1];
			return pathname == `/${currentRoute}`;
		},
		[router]
	);

	const handleLogout = () => {
		store.dispatch(logout());
		store.dispatch(setInfoUser(null));
	};

	return (
		<Fragment>
			<div className={styles.container}>
				<Link onClick={onCLose} href={PATH.Profile} className={clsx(styles.item, {[styles.active]: checkActive(PATH.Profile)})}>
					<div className={styles.icon}>
						<UserOctagon size='20' color='#6F767E' />
					</div>
					<p className={styles.text}>Thông tin cá nhân</p>
				</Link>
				<div
					className={styles.item}
					onClick={() => {
						setOpenLogout(true);
						onCLose();
					}}
				>
					<div className={styles.icon}>
						<Logout size='22' color='#6F767E' />
					</div>
					<p className={styles.text}>Đăng xuất</p>
				</div>
			</div>

			<Dialog
				danger
				open={openLogout}
				onClose={() => setOpenLogout(false)}
				onSubmit={handleLogout}
				title='Đăng xuất'
				note='Bạn có muốn đăng xuất khỏi hệ thống không?'
				titleCancel='Hủy bỏ'
				titleSubmit='Đăng xuất'
			/>
		</Fragment>
	);
}

export default BoxMenuProfile;
