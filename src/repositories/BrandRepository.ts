import { AxiosInstance } from 'axios';
import { BaseRepository } from './BaseRepository';
import { IBrandRepository } from './interfaces/IBrandRepository';
import { Brand } from '@/types/brand';
import { PaginatedApiResponse } from '@/types/common';
import {
    BrandFilterParams,
    BrandStatsDTO,
    BrandListResponseDTO,
    CreateBrandDTO,
    UpdateBrandDTO
} from '@/types/dtos/brand.dto';

export class BrandRepository extends BaseRepository<Brand> implements IBrandRepository {
    constructor(apiClient: AxiosInstance) {
        super(apiClient, '/brands');
    }

    /**
     * Get all brands with filtering and pagination
     */
    async getBrands(params?: BrandFilterParams): Promise<PaginatedApiResponse<Brand>> {
        const response = await this.apiClient.get<PaginatedApiResponse<Brand>>(this.basePath, { params });
        return response.data;
    }

    /**
     * Get brand statistics
     */
    async getBrandStats(): Promise<BrandStatsDTO> {
        const response = await this.apiClient.get<BrandStatsDTO>(`${this.basePath}/stats`);
        return response.data;
    }

    /**
     * Get brands with their product counts
     */
    async getBrandsWithProductCount(params?: BrandFilterParams): Promise<BrandListResponseDTO> {
        const response = await this.apiClient.get<BrandListResponseDTO>(`${this.basePath}/with-product-count`, {
            params
        });
        return response.data;
    }

    /**
     * Toggle brand active status
     */
    async toggleBrandStatus(brandId: number, isActive: boolean): Promise<Brand> {
        const response = await this.apiClient.patch<Brand>(`${this.basePath}/${brandId}/toggle-status`, {
            isActive
        });
        return response.data;
    }

    /**
     * Get products count for a brand
     */
    async getBrandProductCount(brandId: number): Promise<{ total: number; active: number }> {
        const response = await this.apiClient.get<{ total: number; active: number }>(
            `${this.basePath}/${brandId}/product-count`
        );
        return response.data;
    }

    /**
     * Update brand display order
     */
    async updateBrandOrder(orderedIds: number[]): Promise<void> {
        await this.apiClient.put(`${this.basePath}/order`, { orderedIds });
    }

    /**
     * Search brands by name
     */
    async searchBrands(query: string, limit: number = 10): Promise<Brand[]> {
        const response = await this.apiClient.get<Brand[]>(`${this.basePath}/search`, {
            params: { query, limit }
        });
        return response.data;
    }

    // Implement inherited methods from BaseRepository
    async create(data: CreateBrandDTO): Promise<Brand> {
        return super.create(data);
    }

    async update(id: number, data: UpdateBrandDTO): Promise<Brand> {
        return super.update(id, data);
    }

    async delete(id: number): Promise<void> {
        return super.delete(id);
    }

    async getById(id: number): Promise<Brand> {
        return super.getById(id);
    }
}