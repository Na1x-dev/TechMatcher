import { configureStore, createSlice } from '@reduxjs/toolkit';
import activeReducer from './activeSlice';

const loginFormSlice = createSlice({
    name: 'login-form',
    initialState: {
        isVisible: false
    },
    reducers: {
        showLoginForm(state) {
            state.isVisible = true;
        },
    },
});

export const { showLoginForm } = loginFormSlice.actions;

const store = configureStore({
    reducer: {
        active: activeReducer,
        loginForm: loginFormSlice.reducer,
    },
});

export default store;