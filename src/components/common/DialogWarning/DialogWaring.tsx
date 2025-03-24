import Button from '../Button';
import {PiWarningCircleBold} from 'react-icons/pi';
import Popup from '~/components/common/Popup';
import {PropsDialogWarning} from './interfaces';
import clsx from 'clsx';
import styles from './DialogWarning.module.scss';
import {useStyleClass} from '~/common/hooks/usStyleClass';
import {IoClose} from 'react-icons/io5';

function DialogWarning({titleSubmit = 'Xác nhận', titleCancel = 'Hủy bỏ', Icon, className, ...props}: PropsDialogWarning) {
	const styleClass = useStyleClass(props, styles);

	return (
		<Popup open={props.open} onClose={props.onClose}>
			<div className={clsx('effectZoom', styles.popup, styleClass)}>
				<h4 className={styles.titlePopup}>{props.title}</h4>
				<div className={styles.closeIcon} onClick={props.onClose}>
					<IoClose size={22} />
				</div>
				<div className={styles.note}>{props?.note}</div>
				<div className={styles.groupBtnPopup}>
					<Button className='click' grey_2 rounded_8 bold onClick={props.onClose} maxContent small>
						{titleCancel}
					</Button>
					<Button className='click' primary bold rounded_8 onClick={props.onSubmit} maxContent small {...props}>
						{titleSubmit}
					</Button>
				</div>
			</div>
		</Popup>
	);
}

export default DialogWarning;
