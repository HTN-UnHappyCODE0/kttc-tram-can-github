export interface PropsSelectFilterDate {
	typeDate: number | null;
	setTypeDate: (number: number | null) => void;
	date: {
		from: Date | null;
		to: Date | null;
	} | null;
	setDate: (any: any) => any;
	isOptionDateAll?: boolean;
}
