import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllCategories } from '../services/categoryService';
import { Category, PaginatedApiResponse } from '../types';
interface CategoryState {
    items: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
const initialState: CategoryState = {
    items: [],
    status: 'idle',
    error: null,
};
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (params: { pagination?: boolean }, { rejectWithValue }) => {
        // ... (try/catch block calling getAllCategories)
    }
);
export const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => { /* ... / })
.addCase(fetchCategories.fulfilled, (state, action) => {
// ... update state with payload
state.items = action.payload as Category[]; // Handle non-paginated case
})
.addCase(fetchCategories.rejected, (state, action) => { / ... */ });
    },
});
export default categorySlice.reducer;