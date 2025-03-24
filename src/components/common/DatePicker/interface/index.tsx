export interface PropsDatePicker {
	label?: React.ReactNode;
	placeholder: string;
	className?: string;
	value: any;
	icon?: boolean;
	blockOldDay?: boolean;
	name?: string;
	futureDayblock?: number;
	onSetValue(any: any): void;
	onClean?: boolean;
	readOnly?: boolean;
}
