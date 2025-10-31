import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import { LoginResponse } from '@/types';
import { handleAsyncError } from '../../utils/errorHandling';

interface OtpState {
  verificationContext: string | null; // User's email
  verification: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: LoginResponse | null;
  };
  resend: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
}

const initialState: OtpState = {
  verificationContext: null,
  verification: {
    status: 'idle',
    error: null,
    data: null,
  },
  resend: {
    status: 'idle',
    error: null,
  },
};

// Verify OTP thunk
export const verifyOtp = createAsyncThunk<
  LoginResponse,
  { email: string; otpCode: string },
  { rejectValue: string }
>(
  'otp/verify',
  async ({ email, otpCode }, { rejectWithValue }) => {
    try {
      return await authService.verifyOtp(email, otpCode);
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'OTP verification failed'));
    }
  }
);

// Resend OTP thunk
export const resendOtp = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>(
  'otp/resend',
  async (email, { rejectWithValue }) => {
    try {
      return await authService.resendOtp(email);
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error, 'Failed to resend OTP'));
    }
  }
);

export const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    startOtpVerification: (state, action: PayloadAction<string>) => {
      state.verificationContext = action.payload;
    },
    clearOtpState: (state) => {
      Object.assign(state, initialState);
    },
    clearVerificationState: (state) => {
      state.verification = {
        status: 'idle',
        error: null,
        data: null,
      };
    },
    clearResendState: (state) => {
      state.resend = {
        status: 'idle',
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Verify OTP cases
      .addCase(verifyOtp.pending, (state) => {
        state.verification.status = 'loading';
        state.verification.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.verification.status = 'succeeded';
        state.verification.data = action.payload;
        state.verification.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verification.status = 'failed';
        state.verification.error = action.payload as string;
      })
      // Resend OTP cases
      .addCase(resendOtp.pending, (state) => {
        state.resend.status = 'loading';
        state.resend.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resend.status = 'succeeded';
        state.resend.error = null;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resend.status = 'failed';
        state.resend.error = action.payload as string;
      });
  },
});

export const { 
  startOtpVerification, 
  clearOtpState, 
  clearVerificationState, 
  clearResendState 
} = otpSlice.actions;

export default otpSlice.reducer;

// Selectors
export const selectOtpContext = (state: { otp: OtpState }) => state.otp.verificationContext;
export const selectVerificationState = (state: { otp: OtpState }) => state.otp.verification;
export const selectResendState = (state: { otp: OtpState }) => state.otp.resend;
