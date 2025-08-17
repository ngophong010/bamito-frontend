import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: false,
  userInfo: null,
  favourites: [],
  cartId: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.login = true;
      state.userInfo = action.payload;
    },
    logOut: (state) => {
      state.login = initialState.login;
      state.userInfo = initialState.userInfo;
      state.favourites = initialState.favourites;
      state.cartId = initialState.cartId;
    },
    updateAvatar: (state, action) => {
      if (state.userInfo) {
        state.userInfo.avatar = action.payload;
      }
    },
    updateFavourites: (state, action) => {
      state.favourites = action.payload;
    },
    updateCartId: (state, action) => {
      state.cartId = action.payload;
    },
  },
});

export const { logOut, logIn, updateAvatar, updateFavourites, updateCartId } =
  userSlice.actions;

export default userSlice.reducer;
