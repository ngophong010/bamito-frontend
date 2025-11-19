import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types/category';
import { handleAsyncError } from '../../utils/errorHandling';

export interface CategoryState {
  items: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  status: 'idle',
  error: null,
};

// Fetch categories thunk with flexible pagination
export const fetchCategories = createAsyncThunk<
  Category[],
  { pagination?: boolean; page?: number; limit?: number } | undefined,
  { rejectValue: string }
>(
  'categories/fetch',
  async (params, { rejectWithValue }) => {
    try {
      if (params?.pagination === false) {
        return await categoryService.getAllCategoriesList();
      } else {
        const response = await categoryService.getCategories(params);
        return response.items;
      }
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Failed to fetch categories'));
    }
  }
);

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer;

// Selectors
export const selectCategories = (state: { categories: CategoryState }) => state.categories.items;
export const selectCategoriesStatus = (state: { categories: CategoryState }) => state.categories.status;
export const selectCategoriesError = (state: { categories: CategoryState }) => state.categories.error;

// Computed selectors
export const selectCategoriesByParent = (parentId: number | null) => 
  (state: { categories: CategoryState }) => 
    state.categories.items.filter(cat => cat.parentId === parentId);

export const selectCategoryById = (id: number) => 
  (state: { categories: CategoryState }) => 
    state.categories.items.find(cat => cat.id === id);