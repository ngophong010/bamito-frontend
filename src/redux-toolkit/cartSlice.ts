import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { handleGetAllProductCart } from "../services/cartService";

import type { ServiceResponse } from "@/types/shared.js";

import { logOut } from "./userSlice";

interface CartProduct {
  productId: number;
  name: string;
  image: string;
  price: number;
  discount: number;
  quantity: number;
  totalPrice: number;
  sizeName: string;
  // ... and any other properties you need
}

// Define the shape of the cart slice's state
interface CartState {
  allProduct: CartProduct[];
  totalProduct: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the shape of the data returned by your API
interface CartData {
    products: CartProduct[];
    totalProduct: number;
}

const initialState: CartState = {
  allProduct: [],
  totalProduct: 0,
  status: 'idle',
  error: null,
};

export const fetchAllProductCart = createAsyncThunk<
  CartData, // The type of the data returned on success
  { userId: number }, // The type of the payload argument
  { rejectValue: string } // The type of the value returned on failure
>(
  "cart/fetchAllProductCart",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data: res }: { data: ServiceResponse } = await handleGetAllProductCart(payload.userId);
      if (res && res.errCode === 0) {
        // The thunk should RETURN the data. This becomes the `action.payload`
        // in the `fulfilled` case.
        return res.data as CartData;
      } else {
        // If it's a predictable API error, reject with the message.
        return rejectWithValue(res.message || 'Failed to fetch cart.');
      }
    } catch (error: any) {
      if (error?.response?.data?.errCode === -4) {
        // Handle session expiry globally
        dispatch(logOut());
        return rejectWithValue("Phiên bản đăng nhập hết hạn");
      }
      // For unexpected errors, reject with a generic message.
      return rejectWithValue(error.message || 'An unexpected error occurred.');
    }
  }
);

// --- THE SLICE ---

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  // `reducers` are for synchronous actions only
  reducers: {
    clearCart: (state) => {
      state.allProduct = [];
      state.totalProduct = 0;
    }
  },
  // ENHANCEMENT 2: `extraReducers` handles the actions dispatched by `createAsyncThunk`
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllProductCart.fulfilled, (state, action: PayloadAction<CartData>) => {
        state.status = 'succeeded';
        state.allProduct = action.payload.products;
        state.totalProduct = action.payload.totalProduct;
      })
      .addCase(fetchAllProductCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string; // `action.payload` is the string from `rejectWithValue`
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
