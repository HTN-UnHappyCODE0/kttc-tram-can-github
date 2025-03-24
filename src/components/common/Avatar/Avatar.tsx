import {PropsAvatar} from './interfaces';
import clsx from 'clsx';
import styles from './Avatar.module.scss';
import ImageWithFallback from '../ImageWithFallback';
import icons from '~/constants/images/icons';

function Avatar({src, className}: PropsAvatar) {
	return (
		<div className={clsx(styles.container, className)}>
			<ImageWithFallback className={styles.avatar} layout='fill' alt='avatar' src={src || icons.avatarDefault} priority />
		</div>
	);
}

export default Avatar;
