import axios from "../axios";
import type { ServiceResponse } from "@/types/shared";

// --- TYPES ---
interface UserUpdateData {
    userName?: string;
    phoneNumber?: string;
    birthday?: Date;
    address?: string;
    avatar?: File;
}

interface PasswordChangeData {
    currentPassword?: string;
    newPassword?: string;
}

// ===============================================================
// --- USER PROFILE (Actions on your OWN account) ---
// ===============================================================

export const getProfile = async (): Promise<ServiceResponse> => {
  const response = await axios.get(`/api/v1/users/profile`);
  return response.data;
};

export const updateProfile = async (data: UserUpdateData): Promise<ServiceResponse> => {
    const formData = new FormData();

    // FIX: Iterate over the keys and handle each value type explicitly.
    Object.keys(data).forEach(key => {
        const value = data[key as keyof UserUpdateData];

        // First, ensure the value is not null or undefined
        if (value !== undefined && value !== null) {
            
            // Handle File objects directly
            if (value instanceof File) {
                formData.append(key, value);
            } 
            // Handle Date objects by converting them to a standard string format
            else if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } 
            // Handle all other types (string, number, boolean) by converting them to a string
            else {
                formData.append(key, String(value));
            }
        }
    });
    
    const response = await axios.put(`/api/v1/users/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const changePassword = async (data: PasswordChangeData): Promise<ServiceResponse> => {
    const response = await axios.put(`/api/v1/users/profile/change-password`, data);
    return response.data;
};

// ===============================================================
// --- ADMIN-ONLY USER MANAGEMENT ---
// ===============================================================

export const getAllUsers = async (params: { limit?: number; page?: number; name?: string }): Promise<ServiceResponse> => {
  const response = await axios.get(`/api/v1/users`, { params });
  return response.data;
};

export const getUserById = async (id: number): Promise<ServiceResponse> => {
    const response = await axios.get(`/api/v1/users/${id}`);
    return response.data;
};

export const deleteUser = async (id: number): Promise<ServiceResponse> => {
    const response = await axios.delete(`/api/v1/users/${id}`);
    return response.data;
};

