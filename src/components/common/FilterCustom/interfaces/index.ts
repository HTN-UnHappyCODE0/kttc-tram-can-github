export interface PropsFilterCustom {
	listFilter: {id: number | string; name: string}[];
	name: string;
	query?: string;
	isSearch?: boolean;
	disabled?: boolean;
	data?: number | string | null;
	onSetData?: (e: any) => void;
}
