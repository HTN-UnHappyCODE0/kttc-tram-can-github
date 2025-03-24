import {Fragment, useEffect} from 'react';
import {RootState, store} from '~/redux/store';

import {setCookie} from 'cookies-next';
import Lottie from 'react-lottie';

import {PropsSplashScreen} from './interfaces';
import clsx from 'clsx';
import styles from './SplashScreen.module.scss';
import {useSelector} from 'react-redux';
import {getItemStorage, setItemStorage} from '~/common/funcs/localStorage';
import {KEY_STORE} from '~/constants/config';
import {setIp, setIsMobile, setLoading, setRememberPassword} from '~/redux/reducer/site';

import * as loading from '../../../../public/static/anim/loadingScreen.json';
import axios from 'axios';
import {setDataLoginStorage, setStateLogin, setToken} from '~/redux/reducer/auth';
import {setInfoUser} from '~/redux/reducer/user';

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: loading,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

function SplashScreen({}: PropsSplashScreen) {
	const {infoUser} = useSelector((state: RootState) => state.user);
	const {loading, isRememberPassword} = useSelector((state: RootState) => state.site);
	const {token, isLogin, dataLoginStorage} = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		(async () => {
			const state = await getItemStorage(KEY_STORE);

			if (!!state) {
				setCookie(KEY_STORE, {
					token: token,
				});

				store.dispatch(setToken(state.token));
				store.dispatch(setStateLogin(state.isLogin));
				store.dispatch(setInfoUser(state.infoUser));
				store.dispatch(setRememberPassword(state.isRememberPassword));
				store.dispatch(setDataLoginStorage(state.dataLoginStorage));
			}

			store.dispatch(setLoading(false));

			const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			store.dispatch(setIsMobile(isMobile));

			// axios.get('https://api.ipify.org?format=json').then((res) => store.dispatch(setIp(res.data.ip)));
		})();
	}, []);

	// Lưu vào localStorage
	useEffect(() => {
		if (!loading) {
			setItemStorage(KEY_STORE, {
				isLogin: isLogin,
				token: token,
				infoUser: infoUser,
				isRememberPassword: isRememberPassword,
				dataLoginStorage: dataLoginStorage,
			});

			setCookie(KEY_STORE, {
				token: token,
			});
		}
	}, [loading, isLogin, token, infoUser, isRememberPassword, dataLoginStorage]);

	return (
		<Fragment>
			<div className={clsx(styles.container, {[styles.close]: !loading})}>
				<div className={styles.logo}>
					<Lottie options={defaultOptions} />
				</div>
			</div>
		</Fragment>
	);
}

export default SplashScreen;
