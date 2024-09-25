import { createSlice, current } from '@reduxjs/toolkit';

const smartphoneSlice = createSlice({
    name: 'smartphone',
    initialState: {
        smartphone: null,
    },
    reducers: {
        setSmartphone: (state, action) => {
            state.smartphone = action.payload;
        },
    },
});


export const {setSmartphone} = smartphoneSlice.actions;
export default smartphoneSlice.reducer;
