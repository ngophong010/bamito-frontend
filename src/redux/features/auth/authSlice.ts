import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { register as registerService, forgotPassword as forgotPasswordService } from '../services/authService';
import { RegisterData, RegisterResponse } from '../types';
import { startOtpVerification } from './otpSlice';

interface AuthState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    status: 'idle',
    error: null,
};

// Create the async thunk for the registration process
export const registerUser = createAsyncThunk<
    RegisterResponse,
    { data: RegisterData, router: AppRouterInstance },
    { rejectValue: string }
>(
    'auth/registerUser',
    async ({ data, router }, { rejectWithValue }) => {
        try {
            // The service call is simple and clean
            const response = await registerService(data);

            // Handle success inside the thunk
            toast.success(response.message || "Vui lòng kiểm tra email để kích hoạt tài khoản.");
            router.push('/login'); // Redirect on success

            return response;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký.';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const sendPasswordResetOtp = createAsyncThunk <
    { message: string },
    { email: string, router: AppRouterInstance },
    { rejectValue: string }
>(
    'auth/sendPasswordResetOtp',
    async ({ email, router }, { dispatch, rejectWithValue }) => {
        try {
            // The service call is simple and clean
            const response = await forgotPasswordService(email);
            // Handle success side-effects inside the thunk
            toast.success(response.message || "Mã OTP đã được gửi thành công.");

            // Set the context for the next step (the OTP page)
            dispatch(startOtpVerification(email));

            // Navigate to the next step
            router.push('/change-password'); // The next page will get the email from the otpSlice

            return response;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Email không tồn tại hoặc đã xảy ra lỗi.';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default authSlice.reducer;
