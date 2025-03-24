import {Fragment} from 'react';
import Loading from './components/Loading';
import Noti from './components/Noti';
import {PropsDataWrapper} from './interfaces';
import styles from './DataWrapper.module.scss';

function DataWrapper({loading, data = [], children, LoadingCustom, noti = <Noti />}: PropsDataWrapper) {
	return (
		<Fragment>
			{loading ? (
				<div className={styles.container}>
					{LoadingCustom || (
						<div className={styles.loading}>
							<Loading />
						</div>
					)}
				</div>
			) : null}

			{!loading && data?.length <= 0 ? (
				<div className={styles.container}>
					<div className={styles.loading}>{noti}</div>
				</div>
			) : null}

			{!loading && data?.length > 0 ? children : null}
		</Fragment>
	);
}

export default DataWrapper;
