import apiClient from '../axios';
import { UserRepository } from '@/repositories/UserRepository';
import { User } from '@/types/user';
import { PaginatedApiResponse } from '@/types/common';
import {
    CreateUserDTO,
    UpdateUserDTO,
    UpdatePasswordDTO,
    UserFilterParams,
    UserStatsResponse
} from '@/types/dtos/user.dto';

interface UserUpdateData {
    userName?: string;
    phoneNumber?: string;
    birthday?: Date;
    address?: string;
    avatar?: File;
}

class UserService {
    private readonly repository: UserRepository;

    constructor() {
        this.repository = new UserRepository(apiClient);
    }

    /**
     * Get users with filtering and pagination
     */
    async getUsers(params?: UserFilterParams): Promise<PaginatedApiResponse<User>> {
        return this.repository.getUsers(params);
    }

    /**
     * Get a specific user by ID
     */
    async getUserById(userId: number): Promise<User> {
        return this.repository.getById(userId);
    }

    /**
     * Get current user's profile
     */
    async getProfile(): Promise<User> {
        return this.repository.getCurrentUser();
    }

    /**
     * Update current user's profile
     */
    async updateProfile(data: UserUpdateData): Promise<User> {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            const value = data[key as keyof UserUpdateData];
            if (value !== undefined && value !== null) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        // Convert FormData to UpdateUserDTO
        const updateData: UpdateUserDTO = {
            userName: formData.get('userName') as string | undefined,
            phoneNumber: formData.get('phoneNumber') as string | undefined,
            birthday: formData.get('birthday') as string | undefined,
            avatar: formData.get('avatar') as string | undefined
        };

        return this.repository.update(0, updateData); // 0 is a placeholder, the repo will get the current user's ID
    }

    /**
     * Change current user's password
     */
    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        const data: UpdatePasswordDTO = {
            oldPassword: currentPassword,
            newPassword: newPassword
        };
        return this.repository.updatePassword(0, data); // 0 is a placeholder, the repo will get the current user's ID
    }

    /**
     * Create a new user (admin only)
     */
    async createUser(data: CreateUserDTO): Promise<User> {
        return this.repository.create(data);
    }

    /**
     * Update user details (admin only)
     */
    async updateUser(userId: number, data: UpdateUserDTO): Promise<User> {
        return this.repository.update(userId, data);
    }

    /**
     * Delete a user (admin only)
     */
    async deleteUser(userId: number): Promise<void> {
        return this.repository.delete(userId);
    }

    /**
     * Get user statistics (admin only)
     */
    async getUserStats(): Promise<UserStatsResponse> {
        return this.repository.getUserStats();
    }

    /**
     * Get user's favorite products
     */
    async getUserFavorites(userId: number): Promise<number[]> {
        return this.repository.getUserFavorites(userId);
    }

    /**
     * Add a product to user's favorites
     */
    async addToFavorites(userId: number, productId: number): Promise<void> {
        return this.repository.addToFavorites(userId, productId);
    }

    /**
     * Remove a product from user's favorites
     */
    async removeFromFavorites(userId: number, productId: number): Promise<void> {
        return this.repository.removeFromFavorites(userId, productId);
    }

    /**
     * Request password reset
     */
    async requestPasswordReset(email: string): Promise<void> {
        return this.repository.requestPasswordReset(email);
    }

    /**
     * Reset password using token
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        return this.repository.resetPassword(token, newPassword);
    }

    /**
     * Check if an email address is already registered in the system
     * @param email The email address to check
     * @returns Promise<boolean> True if email is registered, false otherwise
     */
    async isEmailRegistered(email: string): Promise<boolean> {
        return this.repository.isEmailRegistered(email);
    }

    
}

// Export a singleton instance
export const userService = new UserService();

