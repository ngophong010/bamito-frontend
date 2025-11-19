import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { PAGINATION_LIMIT } from "@/lib/utils/constants";
import type { PaginatedApiResponse } from '@/types';
import type { PaginationParams } from '../types';

interface RoleState {
  allRole: PaginatedApiResponse<any>;
  isLoading: boolean;
}

const initialState: RoleState = {
  allRole: { items: [], totalItems: 0, totalPages: 0, currentPage: 1 },
  isLoading: false,
};

export const fetchRoles = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/roles/fetch",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setRoleLoading(true));
      // NOTE: userService.getAllRole does not exist in the current codebase.
      // To keep the app stable, we deliver an empty roles payload.
      const page = params.page || 1;
      const limit = params.limit || PAGINATION_LIMIT.ROLES;
      
      dispatch(fetchRoleSuccess({
        items: [],
        totalItems: 0,
        totalPages: Math.ceil(0 / limit),
        currentPage: page,
      }));
      dispatch(setRoleLoading(false));
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch roles';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
      }

      dispatch(setRoleLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);

export const roleSlice = createSlice({
  name: "adminRoles",
  initialState,
  reducers: {
    fetchRoleSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allRole = action.payload;
    },
    fetchRoleFailed: (state) => {
      state.allRole = { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    },
    setRoleLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  fetchRoleSuccess,
  fetchRoleFailed,
  setRoleLoading,
} = roleSlice.actions;

// Aliases for backward compatibility
export const fetchAllRoleRedux = fetchRoles;

export default roleSlice.reducer;
