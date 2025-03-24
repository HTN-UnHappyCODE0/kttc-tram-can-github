export interface PropsStateActive {
	isBox?: boolean;
	stateActive: number;
	listState: {
		state: number;
		text: string;
		backgroundColor: string;
		textColor?: string;
	}[];
}
