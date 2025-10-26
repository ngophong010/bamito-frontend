import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// This assumes your login thunk might set this state
// or the login page redirects with some non-sensitive identifier.

interface OtpState {
  verificationContext: string | null; // e.g., the user's email
  status: 'idle' | 'verifying' | 'resending';
  error: string | null;
}

const initialState: OtpState = {
  verificationContext: null,
  status: 'idle',
  error: null,
};

export const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    // Action to set the context (e.g., email) when the OTP flow begins
    startOtpVerification: (state, action: PayloadAction<string>) => {
        state.verificationContext = action.payload;
    },
    clearOtpState: (state) => {
        Object.assign(state, initialState);
    }
  },
  // You would add extraReducers here to handle async thunks for verifying and resending OTP
});

export const { startOtpVerification, clearOtpState } = otpSlice.actions;
export default otpSlice.reducer;
