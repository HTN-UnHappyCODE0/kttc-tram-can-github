export interface PropsSelectFilterMany {
	isShowAll?: boolean;
	name: string;
	selectedIds: string[];
	setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
	listData: {uuid: string; name: string}[];
}
