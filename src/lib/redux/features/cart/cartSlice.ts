import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { serviceFactory } from '@/factories';
import { CartData, CartItem } from "@/types";
import { handleAsyncError } from '../../utils/errorHandling';
import { logOut } from "../user/userSlice";

interface CartItemUpdateData {
  productId: number;
  quantity: number;
  size: number;
}

interface CartItemIdentifiers {
  productId: number;
  size: number;
}

const cartService = serviceFactory.createCartService();

interface CartState {
  items: CartItem[];
  totalCount: number;
  operations: {
    fetch: { status: 'idle' | 'loading' | 'succeeded' | 'failed'; error: string | null; };
    add: { status: 'idle' | 'loading' | 'succeeded' | 'failed'; error: string | null; };
    remove: { status: 'idle' | 'loading' | 'succeeded' | 'failed'; error: string | null; };
  };
}

const initialState: CartState = {
  items: [],
  totalCount: 0,
  operations: {
    fetch: { status: 'idle', error: null },
    add: { status: 'idle', error: null },
    remove: { status: 'idle', error: null },
  },
};

// Fetch cart thunk
export const fetchCart = createAsyncThunk<
  CartData,
  void,
  { rejectValue: string }
>(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const cartData = await cartService.getCart();
      return {
        products: cartData.items,
        totalProduct: cartData.totalItems
      } as CartData;
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Failed to fetch cart'));
    }
  }
);

// Add item to cart thunk - no side effects
export const addItemToCart = createAsyncThunk<
  void,
  CartItemUpdateData,
  { rejectValue: string }
>(
  "cart/addItem",
  async (itemData, { dispatch, rejectWithValue }) => {
    try {
      await cartService.updateCartItem(itemData.productId, itemData.quantity, itemData.size);
      // Refresh cart data
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Failed to add item'));
    }
  }
);

// Remove item from cart thunk - no side effects
export const removeItemFromCart = createAsyncThunk<
  void,
  CartItemIdentifiers,
  { rejectValue: string }
>(
  "cart/removeItem",
  async (itemIdentifiers, { dispatch, rejectWithValue }) => {
    try {
      await cartService.removeCartItem(itemIdentifiers.productId, itemIdentifiers.size);
      // Refresh cart data
      dispatch(fetchCart());
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Failed to remove item'));
    }
  }
);


export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.operations = {
        fetch: { status: 'idle', error: null },
        add: { status: 'idle', error: null },
        remove: { status: 'idle', error: null },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart cases
      .addCase(fetchCart.pending, (state) => {
        state.operations.fetch.status = 'loading';
        state.operations.fetch.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartData>) => {
        state.operations.fetch.status = 'succeeded';
        state.items = action.payload.products;
        state.totalCount = action.payload.totalProduct;
        state.operations.fetch.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.operations.fetch.status = 'failed';
        state.operations.fetch.error = action.payload as string;
      })
      // Add item cases
      .addCase(addItemToCart.pending, (state) => {
        state.operations.add.status = 'loading';
        state.operations.add.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.operations.add.status = 'succeeded';
        state.operations.add.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.operations.add.status = 'failed';
        state.operations.add.error = action.payload as string;
      })
      // Remove item cases
      .addCase(removeItemFromCart.pending, (state) => {
        state.operations.remove.status = 'loading';
        state.operations.remove.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state) => {
        state.operations.remove.status = 'succeeded';
        state.operations.remove.error = null;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.operations.remove.status = 'failed';
        state.operations.remove.error = action.payload as string;
      })
      // Clear cart on logout
      .addCase(logOut, (state) => {
        state.items = [];
        state.totalCount = 0;
        state.operations = {
          fetch: { status: 'idle', error: null },
          add: { status: 'idle', error: null },
          remove: { status: 'idle', error: null },
        };
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotalCount = (state: { cart: CartState }) => state.cart.totalCount;
export const selectCartFetchStatus = (state: { cart: CartState }) => state.cart.operations.fetch;
export const selectCartAddStatus = (state: { cart: CartState }) => state.cart.operations.add;
export const selectCartRemoveStatus = (state: { cart: CartState }) => state.cart.operations.remove;

// Computed selectors
export const selectCartTotal = (state: { cart: CartState }) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export const selectCartIsEmpty = (state: { cart: CartState }) => state.cart.items.length === 0;
