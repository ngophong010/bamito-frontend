import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LoginDTO } from '@/types/dtos/auth.dto';
import { LoginResponse, UserProfile, ProfileResponse } from '@/types';
import { serviceFactory } from '@/factories';
import { handleAsyncError } from '../../utils/errorHandling';

const authService = serviceFactory.createAuthService();

interface UserState {
  isLoggedIn: boolean;
  profile: UserProfile | null;
  favourites: number[];
  login: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    otpRequired: boolean;
  };
}

const initialState: UserState = {
  isLoggedIn: false,
  profile: null,
  favourites: [],
  login: {
    status: 'idle',
    error: null,
    otpRequired: false,
  },
};

// Login thunk - no side effects
export const loginUser = createAsyncThunk<
  { profile: ProfileResponse | null; otpRequired: boolean; user: UserProfile },
  LoginDTO,
  { rejectValue: string }
>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await authService.login(credentials);
      const { user, otpRequired } = response;

      if (otpRequired) {
        return { 
          profile: null,
          otpRequired: true,
          user: user,
        };
      } else {
        const profileData = await authService.getProfile();
        return { 
          profile: profileData, 
          otpRequired: false,
          user: profileData.user,
        };
      }
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Login failed'));
    }
  }
);

// Fetch user profile thunk
export const fetchUserProfile = createAsyncThunk<
  ProfileResponse,
  void,
  { rejectValue: string }
>(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile();
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Failed to fetch profile'));
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ profile: UserProfile; favourites?: number[] }>) => {
      state.isLoggedIn = true;
      state.profile = action.payload.profile;
      state.favourites = action.payload.favourites || [];
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.profile = null;
      state.favourites = [];
      state.login = {
        status: 'idle',
        error: null,
        otpRequired: false,
      };
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.avatar = action.payload;
      }
    },
    setFavourites: (state, action: PayloadAction<number[]>) => {
      state.favourites = action.payload;
    },
    addFavourite: (state, action: PayloadAction<number>) => {
      if (!state.favourites.includes(action.payload)) {
        state.favourites.push(action.payload);
      }
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      state.favourites = state.favourites.filter(id => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        if (!state.login || typeof state.login !== 'object') {
          state.login = { status: 'idle', error: null, otpRequired: false };
        }
        state.login.status = 'loading';
        state.login.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (!state.login || typeof state.login !== 'object') {
          state.login = { status: 'idle', error: null, otpRequired: false };
        }
        state.login.status = 'succeeded';
        state.login.otpRequired = action.payload.otpRequired;
        
        if (!action.payload.otpRequired && action.payload.profile) {
          state.isLoggedIn = true;
          state.profile = action.payload.profile.user;
          state.favourites = action.payload.profile.favourites || [];
        }
        state.login.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        if (!state.login || typeof state.login !== 'object') {
          state.login = { status: 'idle', error: null, otpRequired: false };
        }
        state.login.status = 'failed';
        state.login.error = action.payload as string;
      })
      // Fetch profile cases
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.profile = action.payload.user;
        state.favourites = action.payload.favourites || [];
      });
  },
});

export const { 
  setUser, 
  logOut, 
  updateAvatar, 
  setFavourites, 
  addFavourite, 
  removeFavourite 
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.profile;
export const selectIsLoggedIn = (state: { user: UserState }) => state.user.isLoggedIn;
export const selectFavourites = (state: { user: UserState }) => state.user.favourites;
export const selectLoginStatus = (state: { user: UserState }) => state.user.login;
export const selectOtpRequired = (state: { user: UserState }) => state.user.login.otpRequired;

// Computed selectors
export const selectUserRole = (state: { user: UserState }) => state.user.profile?.role;
export const selectUserEmail = (state: { user: UserState }) => state.user.profile?.email;
export const selectIsFavourite = (productId: number) => 
  (state: { user: UserState }) => state.user.favourites.includes(productId);

// Legacy export for backward compatibility
export const setLoginSuccess = setUser;
