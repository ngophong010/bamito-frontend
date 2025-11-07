import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import { RegisterDTO } from '@/types/dtos/auth.dto';
import { RegisterResponse } from '@/types';
import { handleAsyncError } from '../../utils/errorHandling';

interface AuthState {
  registration: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: RegisterResponse | null;
  };
  passwordReset: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    email: string | null;
  };
}

const initialState: AuthState = {
  registration: {
    status: 'idle',
    error: null,
    data: null,
  },
  passwordReset: {
    status: 'idle',
    error: null,
    email: null,
  },
};

// Register user thunk - no side effects
export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterDTO,
  { rejectValue: string }
>(
  'auth/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      return await authService.register(data);
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Registration failed'));
    }
  }
);

// Send password reset OTP thunk - no side effects
export const sendPasswordResetOtp = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>(
  'auth/sendPasswordResetOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Failed to send password reset OTP'));
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearRegistrationState: (state) => {
      state.registration = {
        status: 'idle',
        error: null,
        data: null,
      };
    },
    clearPasswordResetState: (state) => {
      state.passwordReset = {
        status: 'idle',
        error: null,
        email: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.registration.status = 'loading';
        state.registration.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registration.status = 'succeeded';
        state.registration.data = action.payload;
        state.registration.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registration.status = 'failed';
        state.registration.error = action.payload as string;
      })
      // Password reset cases
      .addCase(sendPasswordResetOtp.pending, (state) => {
        state.passwordReset.status = 'loading';
        state.passwordReset.error = null;
      })
      .addCase(sendPasswordResetOtp.fulfilled, (state, action) => {
        state.passwordReset.status = 'succeeded';
        state.passwordReset.error = null;
      })
      .addCase(sendPasswordResetOtp.rejected, (state, action) => {
        state.passwordReset.status = 'failed';
        state.passwordReset.error = action.payload as string;
      });
  },
});

export const { clearRegistrationState, clearPasswordResetState } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectRegistrationState = (state: { auth: AuthState }) => state.auth.registration;
export const selectPasswordResetState = (state: { auth: AuthState }) => state.auth.passwordReset;
