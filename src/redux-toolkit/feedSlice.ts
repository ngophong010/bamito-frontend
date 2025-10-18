import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PAGINATION_LIMIT } from "@/utils"; // Assuming PAGINATION_LIMIT is your items per page constant

// ===============================================================
// --- TYPES & INTERFACES ---
// ===============================================================

// Define the shape of a single item from your RSS feed API
export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  // ... any other properties
}

// Define the shape of this slice's state
interface FeedState {
  all_items: FeedItem[];       // Holds ALL items fetched from the API
  current_page_items: FeedItem[]; // Holds only the items for the current page
  currentPage: number;
  totalPages: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FeedState = {
  all_items: [],
  current_page_items: [],
  currentPage: 1,
  totalPages: 1,
  status: 'idle',
  error: null,
};


// ===============================================================
// --- ASYNC THUNKS ---
// ===============================================================

export const fetchAllFeed = createAsyncThunk<
  FeedItem[], // Type of the successful return value
  void,       // No arguments are passed to this thunk
  { rejectValue: string }
>(
  "feed/fetchAllFeed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/rss");
      if (!res.ok) throw new Error('Failed to fetch RSS feed.');
      const result = await res.json();
      // The thunk just returns the payload. Redux Toolkit handles the rest.
      return result.items;
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.message || 'An unexpected error occurred.');
    }
  }
);


// ===============================================================
// --- THE SLICE ---
// ===============================================================

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  // Reducers are for SYNCHRONOUS actions. We'll use one for pagination.
  reducers: {
    setFeedPage: (state, action: PayloadAction<number>) => {
      const page = action.payload;
      state.currentPage = page;
      // Calculate the slice of items for the new page
      state.current_page_items = state.all_items.slice(
        (page - 1) * PAGINATION_LIMIT.FEED,
        page * PAGINATION_LIMIT.FEED
      );
    },
  },
  // extraReducers handles ASYNCHRONOUS actions from createAsyncThunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFeed.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllFeed.fulfilled, (state, action: PayloadAction<FeedItem[]>) => {
        state.status = 'succeeded';
        // When the fetch is complete, store ALL items
        state.all_items = action.payload;
        // Calculate the total pages
        state.totalPages = Math.ceil(action.payload.length / PAGINATION_LIMIT.FEED);
        // Set the initial current page to 1
        state.currentPage = 1;
        // And populate the items for the first page
        state.current_page_items = state.all_items.slice(0, PAGINATION_LIMIT.FEED);
      })
      .addCase(fetchAllFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export the synchronous action for changing the page
export const { setFeedPage } = feedSlice.actions;

export default feedSlice.reducer;
