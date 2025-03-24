import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface SiteState {
	loading: boolean;
	isMobile: boolean;
	ip: string;
	isRememberPassword: boolean;
}

const initialState: SiteState = {
	loading: true,
	isMobile: false,
	ip: '',
	isRememberPassword: false,
};

export const siteSlice = createSlice({
	name: 'site',
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action?.payload;
		},
		setIsMobile: (state, action: PayloadAction<boolean>) => {
			state.isMobile = action.payload;
		},
		setIp: (state, action: PayloadAction<string>) => {
			state.ip = action.payload;
		},
		setRememberPassword: (state, action: PayloadAction<boolean>) => {
			state.isRememberPassword = action.payload;
		},
	},
});

export const {setLoading, setIsMobile, setIp, setRememberPassword} = siteSlice.actions;
// Action creators are generated for each case reducer function
export default siteSlice.reducer;
