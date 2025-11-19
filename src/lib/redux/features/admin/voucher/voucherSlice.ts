import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { serviceFactory } from '@/factories';
import { PAGINATION_LIMIT } from "@/lib/utils/constants";
import type { PaginatedApiResponse } from '@/types';
import type { PaginationParams } from '../types';

const voucherService = serviceFactory.createVoucherService();

interface VoucherState {
  allVoucher: PaginatedApiResponse<any>;
  isLoading: boolean;
}

const initialState: VoucherState = {
  allVoucher: { items: [], totalItems: 0, totalPages: 0, currentPage: 1 },
  isLoading: false,
};

export const fetchVouchers = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/vouchers/fetch",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setVoucherLoading(true));
      const page = params.page || 1;
      const limit = params.limit || PAGINATION_LIMIT.VOUCHERS;

      const res = await voucherService.getAllVouchers({ page, limit });

      dispatch(fetchVoucherSuccess({
        items: res.items,
        totalItems: res.totalItems,
        totalPages: Math.ceil(res.totalItems / limit),
        currentPage: page
      }));
      dispatch(setVoucherLoading(false));

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch vouchers';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
      }

      dispatch(setVoucherLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);

export const voucherSlice = createSlice({
  name: "adminVouchers",
  initialState,
  reducers: {
    fetchVoucherSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allVoucher = action.payload;
    },
    fetchVoucherFailed: (state) => {
      state.allVoucher = { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    },
    setVoucherLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  fetchVoucherSuccess,
  fetchVoucherFailed,
  setVoucherLoading,
} = voucherSlice.actions;

// Aliases for backward compatibility
export const fetchAllVoucherRedux = fetchVouchers;

export default voucherSlice.reducer;
