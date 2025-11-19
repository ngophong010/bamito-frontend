import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { serviceFactory } from '@/factories';
import { PAGINATION_LIMIT } from "@/lib/utils/constants";
import type { PaginatedApiResponse } from '@/types';
import type { PaginationParams } from '../types';

const sizeService = serviceFactory.createSizeService();

interface SizeState {
  allSize: PaginatedApiResponse<any>;
  allInventoryOfTheCategory: PaginatedApiResponse<any>;
  isLoading: boolean;
}

const initialState: SizeState = {
  allSize: { items: [], totalItems: 0, totalPages: 0, currentPage: 1 },
  allInventoryOfTheCategory: { items: [], totalItems: 0, totalPages: 0, currentPage: 1 },
  isLoading: false,
};

export const fetchSizes = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/sizes/fetch",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSizeLoading(true));
      const page = params.page || 1;
      const limit = params.limit || PAGINATION_LIMIT.SIZES;

      const res = await sizeService.getAllSize({ page, limit });

      dispatch(fetchSizeSuccess({
        items: res.items,
        totalItems: res.totalItems,
        totalPages: Math.ceil(res.totalItems / limit),
        currentPage: page
      }));
      dispatch(setSizeLoading(false));

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch sizes';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Session expired, please login again");
      }

      dispatch(setSizeLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchInventorySizesByCategory = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>(
  "admin/sizes/fetchByCategory",
  async (categoryId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSizeLoading(true));
      const res = await sizeService.getAllSizeOfTheCategory(categoryId);
      
      dispatch(fetchSizeOfCategorySuccess({
        items: res.items,
        totalItems: res.totalItems,
        totalPages: 1,
        currentPage: 1
      }));
      dispatch(setSizeLoading(false));

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch category sizes';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
      }

      dispatch(setSizeLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);

export const sizeSlice = createSlice({
  name: "adminSizes",
  initialState,
  reducers: {
    fetchSizeSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allSize = action.payload;
    },
    fetchSizeFailed: (state) => {
      state.allSize = { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    },
    fetchSizeOfCategorySuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allInventoryOfTheCategory = action.payload;
    },
    fetchSizeOfCategoryFailed: (state) => {
      state.allInventoryOfTheCategory = { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    },
    setSizeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  fetchSizeSuccess,
  fetchSizeFailed,
  fetchSizeOfCategorySuccess,
  fetchSizeOfCategoryFailed,
  setSizeLoading,
} = sizeSlice.actions;

// Aliases for backward compatibility
export const fetchAllSizeRedux = fetchSizes;
export const fetchAllInventoryOfTheCategoryRedux = fetchInventorySizesByCategory;

export default sizeSlice.reducer;
