import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// 1. Import the CORRECT, refactored service function and types
import { getMyOrders } from '../../../services/profileOrderService';
import { OrderSummary, PaginatedApiResponse } from '../../../types';

// Import the logOut action to handle cross-slice state changes
import { logOut } from '../user/userSlice';

// 2. Define the state for THIS slice only
interface ProfileOrderState {
  orders: OrderSummary[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileOrderState = {
  orders: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  status: 'idle',
  error: null,
};

// 3. Create the async thunk correctly
export const fetchMyOrders = createAsyncThunk<
  PaginatedApiResponse<OrderSummary>, // Type of the successful return value
  { status?: number; limit?: number; page?: number }, // Type of the argument
  { rejectValue: string }
>(
  'profileOrders/fetchMyOrders', // Use a descriptive action type prefix
  async (params, { rejectWithValue }) => {
    try {
      // 4. The thunk just calls the secure service and RETURNS the data.
      // NO userId is passed! The backend gets it from the token.
      const data = await getMyOrders(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your orders.');
    }
  }
);

// 5. Create the slice
export const profileOrderSlice = createSlice({
  name: 'profileOrders', // Name the slice after the resource
  initialState,
  reducers: {
    // Synchronous reducers can go here if needed
  },
  // 6. Use extraReducers to handle the thunk's lifecycle
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyOrders.fulfilled, (state, action: PayloadAction<PaginatedApiResponse<OrderSummary>>) => {
        state.status = 'succeeded';
        // 7. Update state with the payload returned by the thunk
        state.orders = action.payload.items; // Use the generic 'items' from the PaginatedApiResponse type
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // 8. Handle logout to clear the user's order history from state
      .addCase(logOut, (state) => {
        // Reset to initial state when the user logs out
        Object.assign(state, initialState);
      });
  },
});

export default profileOrderSlice.reducer;
