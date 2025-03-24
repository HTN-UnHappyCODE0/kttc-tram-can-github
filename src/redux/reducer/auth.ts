import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface IDataLoginStorage {
	usernameStorage: string;
	passwordStorage: string;
}

export interface AuthState {
	token: string | null;
	isLogin: boolean;
	dataLoginStorage: IDataLoginStorage | null;
}

const initialState: AuthState = {
	token: null,
	isLogin: false,
	dataLoginStorage: null,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setToken: (state, action: PayloadAction<string | null>) => {
			state.token = action?.payload;
		},
		setStateLogin: (state, action: {payload: boolean}) => {
			state.isLogin = action?.payload;
		},
		logout: (state) => {
			state.isLogin = false;
			state.token = null;
		},
		setDataLoginStorage: (state, action: PayloadAction<IDataLoginStorage | null>) => {
			state.dataLoginStorage = action?.payload;
		},
	},
});

export const {setToken, setStateLogin, logout, setDataLoginStorage} = authSlice.actions;
export default authSlice.reducer;
