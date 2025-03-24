import React, {ForwardedRef} from 'react';
export interface PropsComponentToPrint {
	data: any[];
	columns: {title: string; render: (data: any) => JSX.Element}[];
}
