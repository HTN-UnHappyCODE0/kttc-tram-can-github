import {createContext} from 'react';
import {IForm} from '../MainForgotPassword/interfaces';

export interface IContextForgotPassword {
	form: IForm | null;
	setForm: (any: any) => void;
	type: number | null;
	setType: (any: number) => void;
}

export const ContextForgotPassword = createContext<IContextForgotPassword>({
	form: null,
	setForm: () => null,
	type: null,
	setType: () => null,
});
