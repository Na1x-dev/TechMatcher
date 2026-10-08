import { configureStore, createSlice } from "@reduxjs/toolkit";
import activeReducer from "./activeSlice";
import smartphoneReducer from "./smartphoneSlice";
const loginFormSlice = createSlice({ name: "loginForm", initialState: { isVisible: false }, reducers: { showLoginForm: (s) => { s.isVisible = true; }, hideLoginForm: (s) => { s.isVisible = false; } } });
export const { showLoginForm, hideLoginForm } = loginFormSlice.actions;
export default configureStore({ reducer: { active: activeReducer, smartphone: smartphoneReducer, loginForm: loginFormSlice.reducer } });
