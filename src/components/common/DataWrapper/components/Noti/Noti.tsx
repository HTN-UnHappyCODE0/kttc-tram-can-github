import ImageFill from '~/components/common/ImageFill';
import {PropsNoti} from './interfaces';
import styles from './Noti.module.scss';
import icons from '~/constants/images/icons';
import Button from '~/components/common/Button';
import Image from 'next/image';

function Noti({
	disableButton,
	img = icons.emptyCongTy,
	title = 'Dữ liệu trống',
	des = 'Hiện tại dữ liệu đang trống!',
	titleButton = ' Tạo ngay',
	onClick = () => {},
}: PropsNoti) {
	return (
		<div className={styles.container}>
			<div className={styles.img}>
				<ImageFill className={styles.icon} src={img} />
			</div>
			{title && <h3>{title}</h3>}
			<p>{des}</p>
			{!disableButton ? (
				<div className={styles.btn}>
					<Button p_8_16 rounded_2 onClick={onClick} icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}>
						{titleButton}
					</Button>
				</div>
			) : null}
		</div>
	);
}

export default Noti;
