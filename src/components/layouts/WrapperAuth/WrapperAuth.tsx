import React from 'react';
import {PropsWrapperAuth} from './interfaces';
import styles from './WrapperAuth.module.scss';
import RequiredLogout from '~/components/protected/RequiredLogout';

function WrapperAuth({children}: PropsWrapperAuth) {
	return (
		<RequiredLogout>
			<div className={styles.container}>{children}</div>
		</RequiredLogout>
	);
}

export default WrapperAuth;
