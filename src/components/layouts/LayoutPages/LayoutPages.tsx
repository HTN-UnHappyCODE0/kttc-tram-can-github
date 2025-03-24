import TabNavPage from '~/components/common/TabNavPage';
import WrapperContainer from '../WrapperContainer';
import {PropsLayoutPages} from './interfaces';

import styles from './LayoutPages.module.scss';
import FlexLayout from '../FlexLayout';
import FullColumnFlex from '../FlexLayout/components/FullColumnFlex';

function LayoutPages({children, listPages}: PropsLayoutPages) {
	return (
		<WrapperContainer bg={true}>
			<FlexLayout isPage={true}>
				<TabNavPage listPages={listPages} />
				<FullColumnFlex>
					<div className={styles.main}>{children}</div>
				</FullColumnFlex>
			</FlexLayout>
		</WrapperContainer>
	);
}

export default LayoutPages;
