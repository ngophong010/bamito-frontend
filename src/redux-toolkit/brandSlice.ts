import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { getAllBrands } from '../services/brandService';
import { Brand, PaginatedApiResponse } from '../types';

// 3. Define the state for THIS slice only
interface BrandState {
  items: Brand[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BrandState = {
  items: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  status: 'idle',
  error: null,
};

// 4. Create the async thunk correctly
export const fetchBrands = createAsyncThunk<
  PaginatedApiResponse<Brand>, // Type of the successful return value
  { limit?: number; page?: number; name?: string; pagination?: boolean }, // Type of the argument
  { rejectValue: string }
>(
  'brands/fetchBrands',
  async (params) => {
    try {
      // 5. The thunk just calls the service and RETURNS the data.
      // No more thunkAPI.dispatch!
      const data = await getAllBrands(params);
      return data;
    } catch (error: any) {
      return error.response?.data?.message || 'Failed to fetch brands.';
    }
  }
);

// 6. Create the slice
export const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    // Synchronous reducers go here if needed
  },
  // 7. Use extraReducers to handle the thunk's lifecycle
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBrands.fulfilled, (state, action: PayloadAction<PaginatedApiResponse<Brand>>) => {
        state.status = 'succeeded';
        // 8. Update the state with the payload returned by the thunk
        state.items = action.payload.items; // Assuming the service returns 'items'
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default brandSlice.reducer;
