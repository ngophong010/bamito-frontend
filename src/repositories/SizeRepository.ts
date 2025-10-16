import { AxiosInstance } from 'axios';
import { BaseRepository } from './BaseRepository';
import { Size, PaginatedApiResponse } from '@/types';
import { ISizeRepository } from './interfaces/ISizeRepository';
import { SizeFilterParams, CreateSizeDTO, UpdateSizeDTO } from '@/types/dtos/size.dto';
import { handleAxiosError } from './errors/RepositoryError';

export class SizeRepository
    extends BaseRepository<Size, CreateSizeDTO, UpdateSizeDTO>
    implements ISizeRepository {

    private readonly basePath = '/sizes';

    constructor(private readonly apiClient: AxiosInstance) {
        super(apiClient, '/sizes');
    }

    /**
     * Get all sizes with optional params (page, limit, search, etc.)
     * Maps to: GET /sizes
     */
    async getAll(params?: Record<string, any>): Promise<PaginatedApiResponse<Size>> {
        try {
            const response = await this.apiClient.get<{ data: PaginatedApiResponse<Size> }>(
                this.basePath,
                { params }
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    /**
     * Get sizes with filtering and pagination
     * Maps to: GET /sizes
     */
    async getSizes(params?: SizeFilterParams): Promise<PaginatedApiResponse<Size>> {
        try {
            const response = await this.apiClient.get<{ data: PaginatedApiResponse<Size> }>(
                this.basePath,
                { params }
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    /**
     * Get a size by its numeric ID
     * Maps to: GET /sizes/:id
     */
    async getById(id: number): Promise<Size> {
        try {
            const response = await this.apiClient.get<{ data: Size }>(`${this.basePath}/${id}`);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    /**
     * Create a new size
     * Maps to: POST /sizes
     */
    async create(data: CreateSizeDTO): Promise<Size> {
        try {
            const response = await this.apiClient.post<{ data: Size }>(this.basePath, data);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    /**
     * Update a size by ID
     * Maps to: PUT /sizes/:id
     */
    async update(id: number, data: UpdateSizeDTO): Promise<Size> {
        try {
            const response = await this.apiClient.put<{ data: Size }>(`${this.basePath}/${id}`, data);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    /**
     * Delete a size by ID
     * Maps to: DELETE /sizes/:id
     */
    async delete(id: number): Promise<void> {
        try {
            await this.apiClient.delete(`${this.basePath}/${id}`);
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    /**
     * Get sizes available for a specific category
     * Maps to: GET /categories/:categoryId/sizes
     */
    async getSizesForCategory(categoryId: number): Promise<Size[]> {
        try {
            const response = await this.apiClient.get<{ data: Size[] }>(
                `/categories/${categoryId}/sizes`
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async toggleStatus(id: number, isActive: boolean): Promise<Size> {
        try {
            const response = await this.apiClient.patch<{ data: Size }>(`${this.basePath}/${id}/toggle-status`, { isActive });
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    protected handleError(error: any): never {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}
