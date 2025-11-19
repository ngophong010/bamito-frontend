import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { serviceFactory } from '@/factories';
import { PAGINATION_LIMIT } from "@/lib/utils/constants";
import type { PaginatedApiResponse } from '@/types';
import type { PaginationParams, Subscriber } from '../types';

const userService = serviceFactory.createUserService();

interface SubscriberState {
  allSubscriber: PaginatedApiResponse<Subscriber>;
  isLoading: boolean;
}

const initialState: SubscriberState = {
  allSubscriber: { items: [], totalItems: 0, totalPages: 0, currentPage: 1 },
  isLoading: false,
};

export const fetchSubscribers = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/subscribers/fetch",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setSubscriberLoading(true));
      const page = params.page || 1;
      const limit = params.limit || PAGINATION_LIMIT.SUBSCRIBER;
      const res = await fetch(
        `/api/email?offset=${(page - 1) * limit}&count=${limit}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch subscribers');
      }

      const result = await res.json();
      const totalPages = Math.ceil(result.total_items / PAGINATION_LIMIT.SUBSCRIBER);

      const members = await Promise.all(
        result.members.map(async (member: { email_address: string }) => {
          const emailStatus = await userService.isEmailRegistered(member.email_address);
          return {
            ...member,
            bamito_status: emailStatus ? "Khách hàng" : "Ẩn danh",
          } as Subscriber;
        })
      );

      const payload = {
        items: members,
        totalItems: result.total_items,
        totalPages,
        currentPage: page
      };

      dispatch(fetchSubscriberSuccess(payload));
      dispatch(setSubscriberLoading(false));
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch subscribers';
      console.error(errorMessage, error);
      toast.error(errorMessage);
      dispatch(setSubscriberLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);

export const subscriberSlice = createSlice({
  name: "adminSubscribers",
  initialState,
  reducers: {
    fetchSubscriberSuccess: (state, action: PayloadAction<PaginatedApiResponse<Subscriber>>) => {
      state.allSubscriber = action.payload;
    },
    fetchSubscriberFailed: (state) => {
      state.allSubscriber = { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    },
    setSubscriberLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  fetchSubscriberSuccess,
  fetchSubscriberFailed,
  setSubscriberLoading,
} = subscriberSlice.actions;

// Aliases for backward compatibility
export const fetchAllSubscriber = fetchSubscribers;

export default subscriberSlice.reducer;
