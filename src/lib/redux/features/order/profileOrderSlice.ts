import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getMyOrders } from '@/services/profileOrderService';
import { OrderSummary, PaginatedApiResponse } from '@/types';
import { handleAsyncError } from '../../utils/errorHandling';
import { logOut } from '../user/userSlice';

interface OrderFilterParams {
  status?: number;
  limit?: number;
  page?: number;
}

interface ProfileOrderState {
  items: OrderSummary[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileOrderState = {
  items: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  status: 'idle',
  error: null,
};

// Fetch user's orders thunk
export const fetchMyOrders = createAsyncThunk<
  PaginatedApiResponse<OrderSummary>,
  OrderFilterParams | undefined,
  { rejectValue: string }
>(
  'profileOrders/fetch',
  async (params, { rejectWithValue }) => {
    try {
      return await getMyOrders(params);
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Failed to fetch orders'));
    }
  }
);

export const profileOrderSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action: PayloadAction<PaginatedApiResponse<OrderSummary>>) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logOut, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export const { clearOrders } = profileOrderSlice.actions;
export default profileOrderSlice.reducer;

// Selectors
export const selectMyOrders = (state: { profileOrders: ProfileOrderState }) => state.profileOrders.items;
export const selectOrdersStatus = (state: { profileOrders: ProfileOrderState }) => state.profileOrders.status;
export const selectOrdersError = (state: { profileOrders: ProfileOrderState }) => state.profileOrders.error;
export const selectOrdersPagination = (state: { profileOrders: ProfileOrderState }) => ({
  totalItems: state.profileOrders.totalItems,
  totalPages: state.profileOrders.totalPages,
  currentPage: state.profileOrders.currentPage,
});

// Computed selectors
export const selectHasOrders = (state: { profileOrders: ProfileOrderState }) => 
  state.profileOrders.items.length > 0;

export const selectOrdersByStatus = (status: OrderSummary['status']) => 
  (state: { profileOrders: ProfileOrderState }) => 
    state.profileOrders.items.filter(order => order.status === status);

export const selectRecentOrders = (limit: number = 5) => 
  (state: { profileOrders: ProfileOrderState }) => 
    state.profileOrders.items.slice(0, limit);
