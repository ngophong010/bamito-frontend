import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_LIMIT } from "@/lib/utils/constants";
import { handleAsyncError } from '../../utils/errorHandling';

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
}

interface FeedState {
  items: FeedItem[];
  currentPageItems: FeedItem[];
  currentPage: number;
  totalPages: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FeedState = {
  items: [],
  currentPageItems: [],
  currentPage: 1,
  totalPages: 1,
  status: 'idle',
  error: null,
};


// Fetch RSS feed thunk
export const fetchFeed = createAsyncThunk<
  FeedItem[],
  void,
  { rejectValue: string }
>(
  "feed/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/rss");
      if (!res.ok) throw new Error('Failed to fetch RSS feed');
      const result = await res.json();
      return result.items;
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Failed to fetch RSS feed'));
    }
  }
);


export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      const page = action.payload;
      if (page >= 1 && page <= state.totalPages) {
        state.currentPage = page;
        const startIndex = (page - 1) * PAGINATION_LIMIT.FEED;
        const endIndex = page * PAGINATION_LIMIT.FEED;
        state.currentPageItems = state.items.slice(startIndex, endIndex);
      }
    },
    clearFeed: (state) => {
      state.items = [];
      state.currentPageItems = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action: PayloadAction<FeedItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.totalPages = Math.ceil(action.payload.length / PAGINATION_LIMIT.FEED);
        state.currentPage = 1;
        state.currentPageItems = state.items.slice(0, PAGINATION_LIMIT.FEED);
        state.error = null;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setPage, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;

// Selectors
export const selectFeedItems = (state: { feed: FeedState }) => state.feed.currentPageItems;
export const selectFeedStatus = (state: { feed: FeedState }) => state.feed.status;
export const selectFeedError = (state: { feed: FeedState }) => state.feed.error;
export const selectFeedPagination = (state: { feed: FeedState }) => ({
  currentPage: state.feed.currentPage,
  totalPages: state.feed.totalPages,
  totalItems: state.feed.items.length,
});

// Computed selectors
export const selectHasFeedItems = (state: { feed: FeedState }) => state.feed.items.length > 0;
export const selectCanGoToNextPage = (state: { feed: FeedState }) => 
  state.feed.currentPage < state.feed.totalPages;
export const selectCanGoToPrevPage = (state: { feed: FeedState }) => 
  state.feed.currentPage > 1;
