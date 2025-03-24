export interface PropsIconCustom {
	icon: React.ReactNode;
	tooltip: string;
	onClick?: () => void;
	color?: string;
	href?: string;
	[props: string]: any;
}
