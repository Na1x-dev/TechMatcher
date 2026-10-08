import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({ name: "active", initialState: { isActive: false }, reducers: { toggleActive: (state) => { state.isActive = !state.isActive; }, setActive: (state, action) => { state.isActive = action.payload; } } });
export const { toggleActive, setActive } = slice.actions; export default slice.reducer;
