import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaginatedApiResponse } from '@/types/common';
import { handleAsyncError } from '../utils/errorHandling';

interface EntityState<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const createEntitySlice = <T>(
  name: string,
  fetchFunction: (params: any) => Promise<PaginatedApiResponse<T>>
) => {
  const initialState: EntityState<T> = {
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    status: 'idle',
    error: null,
  };

  const fetchThunk = createAsyncThunk<
    PaginatedApiResponse<T>,
    any,
    { rejectValue: string }
  >(
    `${name}/fetch`,
    async (params, { rejectWithValue }) => {
      try {
        return await fetchFunction(params);
      } catch (error: any) {
        return rejectWithValue(handleAsyncError(error, `Failed to fetch ${name}`));
      }
    }
  );

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      clearItems: (state) => {
        state.items = [];
        state.totalItems = 0;
        state.status = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchThunk.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchThunk.fulfilled, (state, action: PayloadAction<PaginatedApiResponse<T>>) => {
          state.status = 'succeeded';
          state.items = action.payload.items as any;
          state.totalItems = action.payload.totalItems;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
          state.error = null;
        })
        .addCase(fetchThunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
        });
    },
  });

  return {
    slice,
    fetchThunk,
    actions: slice.actions,
    reducer: slice.reducer,
  };
};