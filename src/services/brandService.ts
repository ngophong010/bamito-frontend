import apiClient from './apiClient';
import { BrandRepository } from '@/repositories/BrandRepository';
import { Brand } from '@/types/brand';
import { PaginatedApiResponse } from '@/types/common';
import {
    CreateBrandDTO,
    UpdateBrandDTO,
    BrandFilterParams,
    BrandStatsDTO,
    BrandListResponseDTO
} from '@/types/dtos/brand.dto';

class BrandService {
    private readonly repository: BrandRepository;

    constructor() {
        this.repository = new BrandRepository(apiClient);
    }

    /**
     * Get all brands with filtering and pagination
     */
    async getBrands(params?: BrandFilterParams): Promise<PaginatedApiResponse<Brand>> {
        return this.repository.getBrands(params);
    }

    /**
     * Get all brands as a simple list (not paginated)
     */
    async getAllBrandsList(): Promise<Brand[]> {
        const result = await this.repository.getBrands({ limit: 1000, pagination: false });
        return result.items;
    }

    /**
     * Get a brand by ID
     */
    async getBrandById(id: number): Promise<Brand> {
        return this.repository.getById(id);
    }

    /**
     * Create a new brand
     */
    async createBrand(data: CreateBrandDTO): Promise<Brand> {
        return this.repository.create(data);
    }

    /**
     * Update a brand
     */
    async updateBrand(id: number, data: UpdateBrandDTO): Promise<Brand> {
        return this.repository.update(id, data);
    }

    /**
     * Delete a brand
     */
    async deleteBrand(id: number): Promise<void> {
        return this.repository.delete(id);
    }

    /**
     * Get brand statistics
     */
    async getBrandStats(): Promise<BrandStatsDTO> {
        return this.repository.getBrandStats();
    }

    /**
     * Get brands with product counts
     */
    async getBrandsWithProductCount(params?: BrandFilterParams): Promise<BrandListResponseDTO> {
        return this.repository.getBrandsWithProductCount(params);
    }

    /**
     * Toggle brand active status
     */
    async toggleBrandStatus(brandId: number, isActive: boolean): Promise<Brand> {
        return this.repository.toggleBrandStatus(brandId, isActive);
    }

    /**
     * Get product count for a brand
     */
    async getBrandProductCount(brandId: number): Promise<{ total: number; active: number }> {
        return this.repository.getBrandProductCount(brandId);
    }

    /**
     * Update brand display order
     */
    async updateBrandOrder(orderedIds: number[]): Promise<void> {
        return this.repository.updateBrandOrder(orderedIds);
    }

    /**
     * Search brands by name
     */
    async searchBrands(query: string, limit?: number): Promise<Brand[]> {
        return this.repository.searchBrands(query, limit);
    }
}

// Export a singleton instance
export const brandService = new BrandService();
