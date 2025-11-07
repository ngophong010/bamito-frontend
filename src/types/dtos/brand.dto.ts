import { Brand } from '../brand';

/**
 * Base pagination parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
}

/**
 * DTO for creating a new brand
 */
export interface CreateBrandDTO {
    name: string;
    description?: string;
    logo?: string;
    websiteUrl?: string;
    isActive?: boolean;
}

/**
 * DTO for updating an existing brand
 */
export type UpdateBrandDTO = Partial<CreateBrandDTO>;

/**
 * Parameters for filtering brands
 */
export interface BrandFilterParams extends PaginationParams {
    name?: string;
    isActive?: boolean;
    sortBy?: 'name' | 'createdAt' | 'productCount';
    sortOrder?: 'asc' | 'desc';
    pagination?: boolean;
}

/**
 * Brand statistics DTO
 */
export interface BrandStatsDTO {
    totalBrands: number;
    activeBrands: number;
    inactiveBrands: number;
    totalProducts: number;
    brandsWithProducts: number;
}

/**
 * DTO for brand with product counts
 */
export interface BrandWithProductCountDTO extends Brand {
    productCount: number;
    activeProductCount: number;
}

/**
 * Response DTO for brand list with statistics
 */
export interface BrandListResponseDTO {
    brands: BrandWithProductCountDTO[];
    stats: BrandStatsDTO;
}
