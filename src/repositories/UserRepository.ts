import { AxiosInstance } from 'axios';
import { User } from '@/types/user';
import { IUserRepository } from './interfaces/IUserRepository';
import { PaginatedApiResponse } from '@/types/common';
import {
    CreateUserDTO,
    UpdateUserDTO,
    UpdatePasswordDTO,
    UserFilterParams,
    UserStatsResponse
} from '@/types/dtos/user.dto';
import { handleAxiosError } from './errors/RepositoryError';

export class UserRepository implements IUserRepository {
    private readonly basePath = '/users';

    constructor(private readonly apiClient: AxiosInstance) {}

    async getAll(): Promise<PaginatedApiResponse<User>> {
        try {
            const response = await this.apiClient.get<{ data: PaginatedApiResponse<User> }>(this.basePath);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getUsers(params?: UserFilterParams): Promise<PaginatedApiResponse<User>> {
        try {
            const response = await this.apiClient.get<{ data: PaginatedApiResponse<User> }>(this.basePath, { params });
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getById(id: number): Promise<User> {
        try {
            const response = await this.apiClient.get<{ data: User }>(`${this.basePath}/${id}`);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getCurrentUser(): Promise<User> {
        try {
            const response = await this.apiClient.get<{ data: User }>(`${this.basePath}/me`);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async create(data: CreateUserDTO): Promise<User> {
        try {
            const response = await this.apiClient.post<{ data: User }>(this.basePath, data);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async update(id: number, data: UpdateUserDTO): Promise<User> {
        try {
            const response = await this.apiClient.put<{ data: User }>(`${this.basePath}/${id}`, data);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.apiClient.delete(`${this.basePath}/${id}`);
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async updatePassword(userId: number, data: UpdatePasswordDTO): Promise<void> {
        try {
            await this.apiClient.post(`${this.basePath}/${userId}/password`, data);
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async deactivateUser(userId: number): Promise<User> {
        try {
            const response = await this.apiClient.post<{ data: User }>(`${this.basePath}/${userId}/deactivate`);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async activateUser(userId: number): Promise<User> {
        try {
            const response = await this.apiClient.post<{ data: User }>(`${this.basePath}/${userId}/activate`);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getUserStats(): Promise<UserStatsResponse> {
        try {
            const response = await this.apiClient.get<{ data: UserStatsResponse }>(`${this.basePath}/stats`);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getUserFavorites(userId: number): Promise<number[]> {
        try {
            const response = await this.apiClient.get<{ data: number[] }>(`${this.basePath}/${userId}/favorites`);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async addToFavorites(userId: number, productId: number): Promise<void> {
        try {
            await this.apiClient.post(`${this.basePath}/${userId}/favorites/${productId}`);
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async removeFromFavorites(userId: number, productId: number): Promise<void> {
        try {
            await this.apiClient.delete(`${this.basePath}/${userId}/favorites/${productId}`);
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async verifyEmail(token: string): Promise<void> {
        try {
            await this.apiClient.post(`${this.basePath}/verify-email`, { token });
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async requestPasswordReset(email: string): Promise<void> {
        try {
            await this.apiClient.post(`${this.basePath}/request-password-reset`, { email });
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            await this.apiClient.post(`${this.basePath}/reset-password`, { token, newPassword });
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async isEmailRegistered(email: string): Promise<boolean> {
        try {
            const response = await this.apiClient.post<{ data: { exists: boolean } }>(`${this.basePath}/check-email`, { email });
            return response.data.data.exists;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    
}