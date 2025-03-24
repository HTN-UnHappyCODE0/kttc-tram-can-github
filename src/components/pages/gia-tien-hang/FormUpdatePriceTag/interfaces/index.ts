import {IPriceTag} from '../../MainPriceTagCurrent/interfaces';

export interface PropsFormUpdatePriceTag {
	dataUpdate: IPriceTag | null;
	onClose: () => void;
}
