import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService } from '@/services/productService';
import { ProductListItem, PaginatedApiResponse } from '@/types';
import { handleAsyncError } from '../../utils/errorHandling';

interface SearchParams {
  name: string;
  limit?: number;
  page?: number;
}

interface SearchState {
  results: ProductListItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  lastSearchTerm: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  lastSearchTerm: null,
  status: 'idle',
  error: null,
};

// Search products thunk - no side effects
export const searchProducts = createAsyncThunk<
  PaginatedApiResponse<ProductListItem>,
  SearchParams,
  { rejectValue: string }
>(
  'search/searchProducts',
  async (params, { rejectWithValue }) => {
    try {
      return await productService.getAllProducts(params);
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Search failed'));
    }
  }
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: (state) => {
      Object.assign(state, initialState);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.lastSearchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.lastSearchTerm = action.meta.arg.name;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<PaginatedApiResponse<ProductListItem>>) => {
        state.status = 'succeeded';
        state.results = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearSearch, setSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;

// Selectors
export const selectSearchResults = (state: { search: SearchState }) => state.search.results;
export const selectSearchStatus = (state: { search: SearchState }) => state.search.status;
export const selectSearchError = (state: { search: SearchState }) => state.search.error;
export const selectLastSearchTerm = (state: { search: SearchState }) => state.search.lastSearchTerm;
export const selectSearchPagination = (state: { search: SearchState }) => ({
  totalItems: state.search.totalItems,
  totalPages: state.search.totalPages,
  currentPage: state.search.currentPage,
});

// Computed selectors
export const selectHasSearchResults = (state: { search: SearchState }) => state.search.results.length > 0;
export const selectIsSearching = (state: { search: SearchState }) => state.search.status === 'loading';
export const selectSearchResultsCount = (state: { search: SearchState }) => state.search.totalItems;

// Legacy export for backward compatibility
export const fetchSearchResults = searchProducts;
export const clearSearchResults = clearSearch;
