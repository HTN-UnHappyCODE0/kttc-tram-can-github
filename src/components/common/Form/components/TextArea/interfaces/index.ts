export interface PropsTextArea {
	placeholder: string;
	name: string;
	label?: React.ReactNode | string;
	isRequired?: boolean;
	textRequired?: string;
	min?: number;
	max?: number;
	blur?: boolean;
	showDone?: boolean;
	readOnly?: boolean;
}
