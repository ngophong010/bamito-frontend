import { User } from '@/types/user';
import { IBaseRepository } from './IBaseRepository';
import { PaginatedApiResponse } from '@/types/common';
import { 
    CreateUserDTO, 
    UpdateUserDTO, 
    UpdatePasswordDTO, 
    UserFilterParams,
    UserStatsResponse
} from '@/types/dtos/user.dto';

export interface IUserRepository extends IBaseRepository<User, CreateUserDTO, UpdateUserDTO> {
    /**
     * Get users with filtering and pagination
     */
    getUsers(params?: UserFilterParams): Promise<PaginatedApiResponse<User>>;

    /**
     * Get the currently authenticated user's profile
     */
    getCurrentUser(): Promise<User>;

    /**
     * Update the password for a user
     */
    updatePassword(userId: number, data: UpdatePasswordDTO): Promise<void>;

    /**
     * Deactivate a user account
     */
    deactivateUser(userId: number): Promise<User>;

    /**
     * Reactivate a user account
     */
    activateUser(userId: number): Promise<User>;

    /**
     * Get user statistics
     */
    getUserStats(): Promise<UserStatsResponse>;

    /**
     * Get a user's favorite products
     */
    getUserFavorites(userId: number): Promise<number[]>;

    /**
     * Add a product to user's favorites
     */
    addToFavorites(userId: number, productId: number): Promise<void>;

    /**
     * Remove a product from user's favorites
     */
    removeFromFavorites(userId: number, productId: number): Promise<void>;

    /**
     * Verify user's email address
     */
    verifyEmail(token: string): Promise<void>;

    /**
     * Request password reset
     */
    requestPasswordReset(email: string): Promise<void>;

    /**
     * Reset password using token
     */
    resetPassword(token: string, newPassword: string): Promise<void>;
}