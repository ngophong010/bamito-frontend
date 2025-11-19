import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { serviceFactory } from '@/factories';
import { PAGINATION_LIMIT } from "@/lib/utils/constants";
import type { PaginatedApiResponse } from '@/types';
import type { PaginationParams } from '../types';

const brandService = serviceFactory.createBrandService();

interface BrandState {
  allBrand: PaginatedApiResponse<any>;
  isLoading: boolean;
}

const initialState: BrandState = {
  allBrand: { items: [], totalItems: 0, totalPages: 0, currentPage: 1 },
  isLoading: false,
};

export const fetchBrands = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/brands/fetch",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setBrandLoading(true));
      const page = params.page || 1;
      const limit = params.limit || PAGINATION_LIMIT.BRANDS;

      const res = await brandService.getBrands({ page, limit });

      dispatch(fetchBrandSuccess({
        items: res.items,
        totalItems: res.totalItems,
        totalPages: Math.ceil(res.totalItems / limit),
        currentPage: page
      }));
      dispatch(setBrandLoading(false));

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch brands';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
      }

      dispatch(setBrandLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);

export const brandSlice = createSlice({
  name: "adminBrands",
  initialState,
  reducers: {
    fetchBrandSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allBrand = action.payload;
    },
    fetchBrandFailed: (state) => {
      state.allBrand = { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    },
    setBrandLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  fetchBrandSuccess,
  fetchBrandFailed,
  setBrandLoading,
} = brandSlice.actions;

export default brandSlice.reducer;
