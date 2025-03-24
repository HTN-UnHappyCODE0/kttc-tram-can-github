export interface PropsFilterDateOption {
	date: {
		from: Date | null;
		to: Date | null;
	} | null;
	setDate: (any: any) => void;
	typeDate: number | null;
	setTypeDate: (any: any) => void;
	show: boolean;
	setShow: (any: any) => void;
	isOptionDateAll?: boolean;
}
