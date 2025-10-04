import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { getCart, addOrUpdateCartItem, removeCartItem } from "../services/cartService";
import { CartData, CartItem, CartItemUpdateData, CartItemIdentifiers } from "../types";

// Note: The logOut action is likely handled by a global API interceptor now,
// but we can still listen for it here to clear the cart.
import { logOut } from "./userSlice";

// Define the shape of the cart slice's state
interface CartState {
  products: CartItem[]; // FIX: Use plural 'products' for an array
  totalCount: number;    // FIX: Use a more generic 'totalCount'
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  products: [],
  totalCount: 0,
  status: 'idle',
  error: null,
};

// ===============================================================
// --- ASYNC THUNKS ---
// ===============================================================

// FIX: Rename the thunk and remove the unnecessary payload argument.
export const fetchCart = createAsyncThunk<
  CartData, // Return type on success
  void,     // No argument is passed to the thunk
  { rejectValue: string }
>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      // FIX: Call the new, secure service function with no arguments.
      const cartData = await getCart();
      return cartData;
    } catch (error: any) {
      // The apiClient interceptor might handle global errors,
      // but we can still return a specific error message for this slice.
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart.');
    }
  }
);

export const addItemToCart = createAsyncThunk(
    "cart/addItem",
    async (itemData: CartItemUpdateData, { dispatch, rejectWithValue }) => {
        try {
            await addOrUpdateCartItem(itemData);
            // After successfully adding, re-fetch the entire cart to ensure data is in sync.
            dispatch(fetchCart()); 
        } catch (error: any) {
            toast.error("Thêm sản phẩm thất bại!");
            return rejectWithValue(error.response?.data?.message || 'Failed to add item.');
        }
    }
);

export const removeItemFromCart = createAsyncThunk(
    "cart/removeItem",
    async (itemIdentifiers: CartItemIdentifiers, { dispatch, rejectWithValue }) => {
        try {
            await removeCartItem(itemIdentifiers);
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
            // Also re-fetch the cart to update the state.
            dispatch(fetchCart());
        } catch (error: any) {
            toast.error("Xóa sản phẩm thất bại!");
            return rejectWithValue(error.response?.data?.message || 'Failed to remove item.');
        }
    }
);


// ===============================================================
// --- THE SLICE ---
// ===============================================================

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // This synchronous reducer is now less needed, but can be kept for an instant UI clear on logout.
    clearCartState: (state) => {
      state.products = [];
      state.totalCount = 0;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Cases for fetching the cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartData>) => {
        state.status = 'succeeded';
        state.products = action.payload.products;
        state.totalCount = action.payload.totalProduct; // Match the API response key
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Case for when the user logs out from the userSlice
      .addCase(logOut, (state) => {
          // When the logOut action from userSlice is dispatched anywhere in the app,
          // this cartSlice reducer will also run, clearing its state.
          state.products = [];
          state.totalCount = 0;
          state.status = 'idle';
          state.error = null;
      });
  },
});

export const { clearCartState } = cartSlice.actions;

export default cartSlice.reducer;
