import { IBaseRepository } from './IBaseRepository';
import { Brand } from '@/types/brand';
import { PaginatedApiResponse } from '@/types/common';
import {
    BrandFilterParams,
    BrandStatsDTO,
    BrandListResponseDTO,
} from '@/types/dtos/brand.dto';

export interface IBrandRepository extends IBaseRepository<Brand> {
    /**
     * Get all brands with filtering and pagination
     */
    getBrands(params?: BrandFilterParams): Promise<PaginatedApiResponse<Brand>>;

    /**
     * Get brand statistics
     */
    getBrandStats(): Promise<BrandStatsDTO>;

    /**
     * Get brands with their product counts
     */
    getBrandsWithProductCount(params?: BrandFilterParams): Promise<BrandListResponseDTO>;

    /**
     * Toggle brand active status
     */
    toggleBrandStatus(brandId: number, isActive: boolean): Promise<Brand>;

    /**
     * Get products count for a brand
     */
    getBrandProductCount(brandId: number): Promise<{ total: number; active: number }>;

    /**
     * Update brand display order
     */
    updateBrandOrder(orderedIds: number[]): Promise<void>;

    /**
     * Search brands by name
     */
    searchBrands(query: string, limit?: number): Promise<Brand[]>;
}
