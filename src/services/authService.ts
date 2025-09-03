import axios from "../axios";
import type { ServiceResponse } from "@/types/shared";

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

// ===============================================================
// --- AUTHENTICATION & REGISTRATION ---
// ===============================================================

export const login = async (data: LoginData): Promise<ServiceResponse> => {
  const response = await axios.post(`/api/v1/auth/login`, data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<ServiceResponse> => {
  const response = await axios.post(`/api/v1/auth/register`, data);
  return response.data;
};

export const logout = async (): Promise<ServiceResponse> => {
    const response = await axios.post(`/api/v1/auth/logout`);
    return response.data;
};

export const refreshToken = async (): Promise<ServiceResponse> => {
    const response = await axios.post(`/api/v1/auth/refresh-token`);
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
