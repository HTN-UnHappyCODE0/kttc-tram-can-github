export interface PropsSelectSearch {
	label?: React.ReactNode | string;
	placeholder?: string;
	options: {
		id: string | number;
		name: string;
	}[];
	data: {
		id: string | number;
		name: string;
	};
	setData: (any: any) => void;
	readonly?: boolean;
	isConvertNumber?: boolean;
	unit?: string;
}
