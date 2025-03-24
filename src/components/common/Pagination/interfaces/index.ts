export interface PropsPagination {
	total: number;
	pageSize: number | string;
	currentPage: number;
	onSetPage?: (any: any) => void;
	onSetpageSize?: (any: any) => void;
	dependencies?: Array<any>;
}
