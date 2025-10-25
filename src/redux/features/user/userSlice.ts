import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthCredentials, LoginResponse, UserProfile, ProfileResponse } from '@/types';
import { toast } from 'react-toastify';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { serviceFactory } from '@/factories';
const authService = serviceFactory.createAuthService();

// NOTE: I've replaced your local UserInfo with the more robust UserProfile from /types
// and made the state more consistent.

interface UserState {
  isLoggedIn: boolean;
  profile: UserProfile | null;
  favouriteProductIds: number[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the shape of the data returned by the thunk on success
interface LoginSuccessPayload {
    profile: UserProfile;
    // We can add a flag to indicate if OTP is required
    otpRequired: boolean; 
}

const initialState: UserState = {
  isLoggedIn: false,
  profile: null,
  favouriteProductIds: [],
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk<
  { profile: ProfileResponse, otpRequired: boolean },
  { credentials: AuthCredentials, router: AppRouterInstance },
  { rejectValue: string }
>(
  'user/loginUser',
  async ({ credentials, router }, { rejectWithValue }) => {
    try {
      // Step 1: Call the login service. The service handles the API call.
      // The backend's /login endpoint should now handle the 2FA check logic.
      // It should return a flag indicating if an OTP step is needed.
      const response: LoginResponse = await authService.login(credentials);

      // Let's assume the backend now returns a response like:
      // { status: 'success', data: { user: {...}, otpRequired: true/false } }
      const { user, otpRequired } = response;

      if (otpRequired) {
        // If OTP is required, we redirect immediately.
        // We don't dispatch the user data to the store yet.
        router.push('/login/otp');
        return { 
            profile: { 
                user: user, 
                favourites: [] 
            }, 
            otpRequired: true 
        };
      } else {
        // If login is direct, fetch the full profile
        const profileData = await authService.getProfile();
        
        // On success, redirect to the homepage
        toast.success("Đăng nhập thành công!");
        router.push("/");
        return { profile: profileData, otpRequired: false };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email hoặc mật khẩu không chính xác.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      // The action payload now has a consistent shape from both paths
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ profile: ProfileResponse, otpRequired: boolean }>) => {
        state.status = 'succeeded';
        // Only set login state if OTP was not required.
        if (!action.payload.otpRequired) {
            state.isLoggedIn = true;
            state.profile = action.payload.profile.user;
            state.favouriteProductIds = action.payload.profile.favourites;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setLoginSuccess, logOut, updateAvatar, setFavourites } = userSlice.actions;

export default userSlice.reducer;
