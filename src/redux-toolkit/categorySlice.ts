import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { categoryService } from '../services/categoryService';
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
    async (params: { pagination?: boolean } = {}, { rejectWithValue }) => {
        try {
            if (params.pagination === false) {
                return await categoryService.getAllCategoriesList();
            } else {
                const response = await categoryService.getCategories();
                return response.items;
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch categories');
        }
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
state.status = 'succeeded';
state.items = action.payload;
state.error = null;
})
.addCase(fetchCategories.rejected, (state, action) => { / ... */ });
    },
});
export default categorySlice.reducer;