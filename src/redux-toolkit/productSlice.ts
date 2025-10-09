// src/redux-toolkit/productSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Import service factory
import { serviceFactory } from '@/factories';
const productService = serviceFactory.createProductService();
const favouriteService = serviceFactory.createFavouriteService();
import { ProductListItem, PaginatedApiResponse } from '@/types';

// 2. Define a clean, focused state. We only need ONE list of products.
interface ProductState {
  items: ProductListItem[]; // The current list of products being displayed
  // All pagination state is kept here, with its data
  totalItems: number;
  totalPages: number;
  currentPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  status: 'idle',
  error: null,
};

// 3. Create a single, powerful thunk for fetching products
// The parameters will tell it WHICH products to fetch.
export const fetchProducts = createAsyncThunk<
  PaginatedApiResponse<ProductListItem>,
  {
    type: 'all' | 'category' | 'sale' | 'favourite'; // Differentiates the query
    categoryId?: number;
    params?: { limit?: number; page?: number; sort?: string; name?: string; filter?: any };
  },
  { rejectValue: string }
>(
  'products/fetchProducts',
  async (query, { rejectWithValue }) => {
    try {
      // Use a switch statement to call the correct service function
      switch (query.type) {
        case 'category':
          if (!query.categoryId) throw new Error('Category ID is required.');
          return await productService.getProductsByCategory(query.categoryId, query.params);
        case 'sale':
          return await productService.getProductsOnSale(query.params);
        case 'favourite':
          return await favouriteService.getMyFavourites(query.params);
        case 'all':
        default:
          return await productService.getAllProducts(query.params);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products.');
    }
  }
);


// 4. Create the slice
export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Synchronous reducers, e.g., to clear the product list
    clearProducts: (state) => {
        state.items = [];
        state.totalItems = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<PaginatedApiResponse<ProductListItem>>) => {
        state.status = 'succeeded';
        // The slice is updated with whatever list was fetched, regardless of type.
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
