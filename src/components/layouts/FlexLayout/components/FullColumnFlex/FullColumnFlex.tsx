import React from 'react';

import {PropsFullColumnFlex} from './interfaces';
import styles from './FullColumnFlex.module.scss';

function FullColumnFlex({children}: PropsFullColumnFlex) {
	return <div className={styles.flex_1}>{children}</div>;
}

export default FullColumnFlex;
