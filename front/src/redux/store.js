import { configureStore } from '@reduxjs/toolkit';
import activeReducer from './activeSlice';

const store = configureStore({
    reducer: {
        active: activeReducer,
    },
});

export default store;