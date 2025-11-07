import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

interface AdminUIState {
  loading: Record<string, boolean>;
  searchTextProductAdmin: string | null;
  timeReport: {
    timeStart: number;
    timeEnd: number;
  };
}

const initialState: AdminUIState = {
  loading: {},
  searchTextProductAdmin: null,
  timeReport: {
    timeStart: dayjs().startOf('month').valueOf(),
    timeEnd: dayjs().endOf('month').valueOf(),
  },
};

export const adminUISlice = createSlice({
  name: 'adminUI',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading;
    },
    setSearchTextProductAdmin: (state, action: PayloadAction<string | null>) => {
      state.searchTextProductAdmin = action.payload;
    },
    setTimeReport: (state, action: PayloadAction<{ timeStart: number; timeEnd: number }>) => {
      state.timeReport = action.payload;
    },
  },
});

export const { setLoading, setSearchTextProductAdmin, setTimeReport } = adminUISlice.actions;
export default adminUISlice.reducer;
