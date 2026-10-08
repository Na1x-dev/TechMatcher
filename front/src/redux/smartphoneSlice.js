import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({ name: "smartphone", initialState: { smartphone: null }, reducers: { setSmartphone: (state, action) => { state.smartphone = action.payload; } } });
export const { setSmartphone } = slice.actions; export default slice.reducer;
