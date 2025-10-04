import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/types"; // It's better to import from a central types file

// NOTE: I've replaced your local UserInfo with the more robust UserProfile from /types
// and made the state more consistent.

interface UserState {
  isLoggedIn: boolean;
  profile: UserProfile | null;
  favouriteProductIds: number[];
}

const initialState: UserState = {
  isLoggedIn: false,
  profile: null,
  favouriteProductIds: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set user data upon successful login
    setLoginSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isLoggedIn = true;
      state.profile = action.payload;
    },
    // Action to clear all user data on logout
    logOut: (state) => {
      state.isLoggedIn = false;
      state.profile = null;
      state.favouriteProductIds = [];
    },
    // Action to update just the avatar
    updateAvatar: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.avatar = action.payload;
      }
    },
    // Action to set the full list of favourite product IDs
    setFavourites: (state, action: PayloadAction<number[]>) => {
      state.favouriteProductIds = action.payload;
    },
  },
});

// Export the synchronous actions
export const { setLoginSuccess, logOut, updateAvatar, setFavourites } = userSlice.actions;

export default userSlice.reducer;
