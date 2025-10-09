import { ProductListItem, ProductDetails } from '@/types/product';
import { PaginatedApiResponse } from '@/types/common';
import { IBaseRepository } from './IBaseRepository';

export interface ProductFilterOptions {
    brandId?: number[];
    price?: [number, number];
}

export interface IProductRepository extends IBaseRepository<ProductListItem, FormData, FormData, ProductDetails, ProductDetails> {
    /**
     * Get detailed information about a specific product
     */
    getProductDetails(productId: string): Promise<ProductDetails>;

    /**
     * Get products by category with filtering and pagination
     */
    getByCategory(
        categoryId: number,
        params?: {
            limit?: number;
            page?: number;
            sort?: string;
            filter?: ProductFilterOptions;
        }
    ): Promise<PaginatedApiResponse<ProductListItem>>;

    /**
     * Get products that are currently on sale
     */
    getProductsOnSale(params?: {
        limit?: number;
        page?: number;
        sort?: string;
    }): Promise<PaginatedApiResponse<ProductListItem>>;
}