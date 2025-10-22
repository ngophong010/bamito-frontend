import apiClient from './apiClient';
import axios from 'axios';
import type { ServiceResponse } from "@/types/common";
import { AuthCredentials, LoginResponse, UserProfile, RegisterResponse, SuccessApiResponse } from '../types';
import { ResetPasswordData } from '@/types';
import { jwtManager, TokenPair } from '@/lib/auth';

// --- TYPE DEFINITIONS for function parameters ---
interface LoginData {
  email: string;
  password?: string; // Password might be omitted for social logins in the future
}

interface RegisterData {
  email: string;
  userName: string;
  password?: string;
  roleId: number; // e.g., 2 for Customer
}

interface PasswordResetData {
  email: string;
  otpCode: string;
  password?: string; // new password
}

export interface ProfileResponse {
  user: UserProfile;
  favourites: number[];
}

// ===============================================================
// --- AUTHENTICATION & REGISTRATION ---
// ===============================================================

export const login = async (credentials: AuthCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<SuccessApiResponse<LoginResponse>>('/auth/login', credentials);
  const loginData = response.data.data;
  
  // Store tokens if login successful and no OTP required
  if (loginData.accessToken && !loginData.otpRequired) {
    jwtManager.setTokens({
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken
    });
  }
  
  return loginData;
};

/**
 * Performs a user registration API call.
 * @param data The user's registration details.
 * @returns A promise that resolves to an object containing a success message.
 */
export const register = async (data: RegisterData): Promise<RegisterResponse> => {
    // Tell Axios to expect this specific response shape
    const response = await apiClient.post<SuccessApiResponse<RegisterResponse>>('/auth/register', data);
    // Extract and return ONLY the data payload
    return response.data.data;
};

export const logout = async (): Promise<ServiceResponse> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Continue with logout even if API call fails
    console.warn('Logout API call failed:', error);
  } finally {
    // Always clear tokens on logout
    jwtManager.clearTokens();
  }
  return { errCode: 0, message: 'Logged out successfully' };
};

/**
 * Verifies a user's OTP code.
 * Maps to: POST /api/v1/auth/verify-otp
 * @param email - The user's email (the verification context).
 * @param otpCode - The code entered by the user.
 * @returns The full user profile data on success (completes the login).
 */
export const verifyOtp = async (email: string, otpCode: string): Promise<LoginResponse> => {
  const response = await apiClient.post<SuccessApiResponse<LoginResponse>>('/auth/verify-otp', {
    email,
    otpCode
  });
  const loginData = response.data.data;
  
  // Store tokens after successful OTP verification
  if (loginData.accessToken) {
    jwtManager.setTokens({
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken
    });
  }
  
  return loginData;
};

/**
 * Requests to resend a new OTP code to the user.
 * Maps to: POST /api/v1/auth/resend-otp
 * @param email - The user's email.
 */
export const resendOtp = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/resend-otp', { email });
  return response.data;
};

export const refreshToken = async (): Promise<ServiceResponse> => {
  const response = await axios.post(`/api/v1/auth/refresh-token`);
  return response.data;
};

/**
 * Fetches the full profile for the currently authenticated user.
 * Maps to: GET /api/v1/profile
 */
export const getProfile = async (): Promise<ProfileResponse> => {
  // Tell Axios to expect this specific response shape
  const response = await apiClient.get<SuccessApiResponse<ProfileResponse>>('/profile');
  // Extract and return ONLY the data payload
  return response.data.data;
};

/**
 * Initiates the password reset process by requesting an OTP for a given email.
 * Maps to: POST /api/v1/auth/forgot-password
 * @param email - The user's email address.
 */
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

// ===============================================================
// --- PASSWORD MANAGEMENT ---
// ===============================================================

export const sendPasswordResetOtp = async (email: string): Promise<ServiceResponse> => {
  const response = await axios.post(`/api/v1/auth/password/send-otp`, { email });
  return response.data;
};

export const resetPasswordWithOtp = async (data: PasswordResetData): Promise<ServiceResponse> => {
  const response = await axios.put(`/api/v1/auth/password/reset`, data);
  return response.data;
};

/**
 * Completes the password reset process using a secure token, OTP, and new password.
 * Maps to: POST /api/v1/auth/reset-password
 */
export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/reset-password', data);
  return response.data;
};

// Create AuthService class to match repository pattern
class AuthService {
  async login(credentials: AuthCredentials): Promise<LoginResponse> {
    return login(credentials);
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    return register(data);
  }

  async logout(): Promise<ServiceResponse> {
    return logout();
  }

  async verifyOtp(email: string, otpCode: string): Promise<LoginResponse> {
    return verifyOtp(email, otpCode);
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    return resendOtp(email);
  }

  async refreshToken(): Promise<ServiceResponse> {
    return refreshToken();
  }

  async getProfile(): Promise<ProfileResponse> {
    return getProfile();
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return forgotPassword(email);
  }

  async sendPasswordResetOtp(email: string): Promise<ServiceResponse> {
    return sendPasswordResetOtp(email);
  }

  async resetPasswordWithOtp(data: PasswordResetData): Promise<ServiceResponse> {
    return resetPasswordWithOtp(data);
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return resetPassword(data);
  }
}

// Export singleton instance
export const authService = new AuthService();
