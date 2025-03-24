export interface PropsBaseLayout {
	children: any;
	title: string;
	bgLight?: boolean;
}

export interface TContextBaseLayout {
	showFull?: boolean;
	setShowFull?: (boolean: boolean) => void;
}
