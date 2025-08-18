import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paginators: {},
};

export const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPaginationData: (state, action) => {
      const { paginatorId, page, limit, totalItems } = action.payload;
      if (!state.paginators[paginatorId]) {
        state.paginators[paginatorId] = {};
      }
      state.paginators[paginatorId].page = page;
      state.paginators[paginatorId].limit = limit;
      state.paginators[paginatorId].totalItems = totalItems;
    },
    setPage: (state, action) => {
      const { paginatorId, page } = action.payload;
      if (state.paginators[paginatorId]) {
        state.paginators[paginatorId].page = page;
      }
    },

    nextPage: (state, action) => {
      const { paginatorId } = action.payload;
      const paginator = state.paginators[paginatorId];
      if (paginator) {
        const totalPages = Math.ceil(
          paginator.totalItems / paginator.limit
        );
        if (paginator.page < totalPages) {
          paginator.page += 1;
        }
      }
    },
    prevPage: (state, action) => {
      const { paginatorId } = action.payload;
      const paginator = state.paginators[paginatorId];
      if (paginator && paginator.page > 1) {
        paginator.page -= 1;
      }
    },
    resetPaginatior: (state, action) => {
      const { paginatorId } = action.payload;
      if (state.paginators[paginatorId]) {
        state.paginators[paginatorId].page= 1;
      } 
    }
    },
});

export const { setPaginationData, setPage, nextPage, prevPage, resetPaginator } = paginationSlice.actions;

export default paginationSlice.reducer;
