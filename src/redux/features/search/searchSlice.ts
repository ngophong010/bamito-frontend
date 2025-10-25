import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// 1. Import the CORRECT, refactored service function and types
import { productService } from '../services/productService';
import { ProductListItem, PaginatedApiResponse } from '../types';

// 2. Define the state for THIS slice only. We'll only store the server data here.
interface SearchState {
  results: ProductListItem[];
  totalItems: number;
  // Let's keep a copy of the search text that *produced* these results for context
  lastSearchTerm: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  totalItems: 0,
  lastSearchTerm: null,
  status: 'idle',
  error: null,
};

// 3. Create the async thunk correctly
export const fetchSearchResults = createAsyncThunk<
  PaginatedApiResponse<ProductListItem>, // Type of the successful return value
  { name: string; limit?: number; page?: number }, // Type of the argument
  { rejectValue: string }
>(
  'search/fetchResults', // Use a descriptive action type prefix
  async (params, { rejectWithValue }) => {
    try {
      // The thunk just calls the service and RETURNS the data.
      const data = await productService.getAllProducts(params);
      return data;
    } catch (error: any) {
      toast.error('Search failed to load.');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch search results.');
    }
  }
);

// 4. Create the slice
export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Add a reducer to clear search results, e.g., when the user clears the search box.
    clearSearchResults: (state) => {
      state.results = [];
      state.totalItems = 0;
      state.lastSearchTerm = null;
      state.status = 'idle';
    },
  },
  // 5. Use extraReducers to handle the thunk's lifecycle
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state, action) => {
        state.status = 'loading';
        // Store the search term that initiated this fetch
        state.lastSearchTerm = action.meta.arg.name;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action: PayloadAction<PaginatedApiResponse<ProductListItem>>) => {
        state.status = 'succeeded';
        // 6. Update state with the payload returned by the thunk
        state.results = action.payload.items;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
