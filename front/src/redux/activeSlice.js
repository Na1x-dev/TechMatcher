import {createSlice} from '@reduxjs/toolkit';



const activeSlice  = createSlice({
    name: 'active',
    initialState: {
        isActive: false,
    },
    reducers: {
        toggleActive(state){
            state.isActive = !state.isActive;
        },
        setActive(state, action) {
            state.isActive = action.payload;
        },
    },
});

export const {toggleActive, setActive} = activeSlice.actions;
export default activeSlice.reducer;