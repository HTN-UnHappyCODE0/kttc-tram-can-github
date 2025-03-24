export interface PropsDialogWarning {
	open: boolean;
	title: string;
	note?: string | React.ReactNode;
	Icon?: any;
	onClose: () => any;
	onSubmit: () => any;
	[props: string]: any;
}
