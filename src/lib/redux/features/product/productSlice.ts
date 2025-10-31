import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { serviceFactory } from '@/factories';
import { ProductListItem, PaginatedApiResponse } from '@/types';
import { handleAsyncError } from '../../utils/errorHandling';

const productService = serviceFactory.createProductService();
const favouriteService = serviceFactory.createFavouriteService();

type ProductQueryType = 'all' | 'category' | 'sale' | 'favourite';

interface ProductQuery {
  type: ProductQueryType;
  categoryId?: number;
  params?: {
    limit?: number;
    page?: number;
    sort?: string;
    name?: string;
    filter?: any;
  };
}

interface ProductState {
  items: ProductListItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastQuery: ProductQuery | null;
}

const initialState: ProductState = {
  items: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  status: 'idle',
  error: null,
  lastQuery: null,
};

// Fetch products thunk with query tracking
export const fetchProducts = createAsyncThunk<
  { data: PaginatedApiResponse<ProductListItem>; query: ProductQuery },
  ProductQuery,
  { rejectValue: string }
>(
  'products/fetch',
  async (query, { rejectWithValue }) => {
    try {
      let data: PaginatedApiResponse<ProductListItem>;
      
      switch (query.type) {
        case 'category':
          if (!query.categoryId) throw new Error('Category ID is required');
          data = await productService.getProductsByCategory(query.categoryId, query.params);
          break;
        case 'sale':
          data = await productService.getProductsOnSale(query.params);
          break;
        case 'favourite':
          data = await favouriteService.getMyFavourites(query.params);
          break;
        case 'all':
        default:
          data = await productService.getAllProducts(query.params);
          break;
      }
      
      return { data, query };
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Failed to fetch products'));
    }
  }
);


export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPages = 1;
      state.currentPage = 1;
      state.status = 'idle';
      state.error = null;
      state.lastQuery = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data.items;
        state.totalItems = action.payload.data.totalItems;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
        state.lastQuery = action.payload.query;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;

// Selectors
export const selectProducts = (state: { products: ProductState }) => state.products.items;
export const selectProductsStatus = (state: { products: ProductState }) => state.products.status;
export const selectProductsError = (state: { products: ProductState }) => state.products.error;
export const selectProductsPagination = (state: { products: ProductState }) => ({
  totalItems: state.products.totalItems,
  totalPages: state.products.totalPages,
  currentPage: state.products.currentPage,
});
export const selectLastQuery = (state: { products: ProductState }) => state.products.lastQuery;

// Computed selectors
export const selectHasProducts = (state: { products: ProductState }) => state.products.items.length > 0;
export const selectProductsByBrand = (brandId: string) => 
  (state: { products: ProductState }) => 
    state.products.items.filter(product => product.brand?.brandId === brandId);
export const selectProductsInPriceRange = (min: number, max: number) => 
  (state: { products: ProductState }) => 
    state.products.items.filter(product => product.price >= min && product.price <= max);
export const selectIsCurrentQuery = (query: ProductQuery) => 
  (state: { products: ProductState }) => 
    JSON.stringify(state.products.lastQuery) === JSON.stringify(query);
