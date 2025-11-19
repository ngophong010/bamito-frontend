import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PaginatedApiResponse } from '@/types';

interface InventoryState {
  allInventory: PaginatedApiResponse<any>;
  productData: any;
  dataPost: any[];
  isLoading: boolean;
}

const initialState: InventoryState = {
  allInventory: { items: [], totalItems: 0, totalPages: 0, currentPage: 1 },
  productData: {},
  dataPost: [],
  isLoading: false,
};

export const inventorySlice = createSlice({
  name: "adminInventory",
  initialState,
  reducers: {
    fetchInventorySuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allInventory = action.payload;
    },
    fetchInventoryFailed: (state) => {
      state.allInventory = { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    },
    setInventoryLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setProductData: (state, action: PayloadAction<any>) => {
      state.productData = action.payload;
    },
    updateDataPost: (state, action: PayloadAction<any[]>) => {
      state.dataPost = action.payload;
    },
  },
});

export const {
  fetchInventorySuccess,
  fetchInventoryFailed,
  setInventoryLoading,
  setProductData,
  updateDataPost,
} = inventorySlice.actions;

// Aliases for backward compatibility
export const CRUDInventory = setProductData;
export const UpdateDataPost = updateDataPost;

export default inventorySlice.reducer;
