import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaginatedApiResponse } from '@/types/common';
import { OrderSummary } from '@/types/order';
import { User } from '@/types/user';
import { ProductListItem } from '@/types/product';
import { Brand } from '@/types/brand';
import { Category } from '@/types/category';
import { Size } from '@/types/size';

// Subscriber interface
interface Subscriber {
  email_address: string;
  bamito_status: 'Khách hàng' | 'Ẩn danh';
}

// Legacy compatibility state - will be gradually removed
interface AdminState {
  // Legacy fields for backward compatibility
  isLoading: boolean;
  allSubscriber: PaginatedApiResponse<Subscriber>;
  allUser: PaginatedApiResponse<User>;
  allRole: PaginatedApiResponse<any>;
  allBrand: PaginatedApiResponse<Brand>;
  allCategory: PaginatedApiResponse<Category>;
  allSize: PaginatedApiResponse<Size>;
  allProduct: PaginatedApiResponse<ProductListItem>;
  allInventory: PaginatedApiResponse<any>;
  allInventoryOfTheCategory: PaginatedApiResponse<any>;
  allVoucher: PaginatedApiResponse<any>;
  allOrder: PaginatedApiResponse<OrderSummary>;
  allProductOrder: PaginatedApiResponse<any>;
  productData: any;
  dataPost: any[];
}

const emptyPage = { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };

const initialState: AdminState = {
  isLoading: false,
  allSubscriber: { ...emptyPage },
  allUser: { ...emptyPage },
  allRole: { ...emptyPage },
  allBrand: { ...emptyPage },
  allCategory: { ...emptyPage },
  allSize: { ...emptyPage },
  allProduct: { ...emptyPage },
  allInventory: { ...emptyPage },
  allInventoryOfTheCategory: { ...emptyPage },
  allVoucher: { ...emptyPage },
  allOrder: { ...emptyPage },
  allProductOrder: { ...emptyPage },
  productData: {},
  dataPost: []
};

// Legacy thunks - DEPRECATED: Use new focused slices instead
// These are kept for backward compatibility only

// Legacy slice - DEPRECATED: Use new focused slices instead
export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    loadingAdmin: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    fetchAllSubscriberSuccess: (state, action: PayloadAction<PaginatedApiResponse<Subscriber>>) => {
      state.allSubscriber = action.payload;
    },
    fetchAllUserSuccess: (state, action: PayloadAction<PaginatedApiResponse<User>>) => {
      state.allUser = action.payload;
    },
    fetchAllRoleSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allRole = action.payload as any;
    },
    fetchAllBrandSuccess: (state, action: PayloadAction<PaginatedApiResponse<Brand>>) => {
      state.allBrand = action.payload;
    },
    fetchAllCategorySuccess: (state, action: PayloadAction<PaginatedApiResponse<Category>>) => {
      state.allCategory = action.payload;
    },
    fetchAllSizeSuccess: (state, action: PayloadAction<PaginatedApiResponse<Size>>) => {
      state.allSize = action.payload;
    },
    fetchAllProductSuccess: (state, action: PayloadAction<PaginatedApiResponse<ProductListItem>>) => {
      state.allProduct = action.payload;
    },
    fetchAllInventorySuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allInventory = action.payload;
    },
    fetchAllInventoryOfTheCategorySuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allInventoryOfTheCategory = action.payload;
    },
    fetchAllVoucherSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allVoucher = action.payload;
    },
    fetchAllOrderSuccess: (state, action: PayloadAction<PaginatedApiResponse<OrderSummary>>) => {
      state.allOrder = action.payload;
    },
    fetchAllProductOrderSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allProductOrder = action.payload;
    },
    CRUDInventory: (state, action) => {
      state.productData = action.payload;
    },
    UpdateDataPost: (state, action) => {
      state.dataPost = action.payload;
    },
  },
});

// Legacy exports for backward compatibility
export const {
  fetchAllUserSuccess,
  fetchAllRoleSuccess,
  loadingAdmin,
  fetchAllBrandSuccess,
  fetchAllCategorySuccess,
  fetchAllSizeSuccess,
  fetchAllProductSuccess,
  CRUDInventory,
  fetchAllInventorySuccess,
  fetchAllInventoryOfTheCategorySuccess,
  UpdateDataPost,
  fetchAllVoucherSuccess,
  fetchAllOrderSuccess,
  fetchAllProductOrderSuccess,
  fetchAllSubscriberSuccess,
} = adminSlice.actions;

// MIGRATION NOTICE:
// This slice is deprecated. Use the new focused slices:
// - userAdminSlice for user management
// - productAdminSlice for product management  
// - orderAdminSlice for order management
// - adminUISlice for UI state

export default adminSlice.reducer;
