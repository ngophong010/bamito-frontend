import { AxiosInstance } from 'axios';
import { BaseRepository } from './BaseRepository';
import { IProductRepository, ProductFilterOptions } from './interfaces/IProductRepository';
import { ProductListItem, ProductDetails } from '@/types/product';
import { PaginatedApiResponse, SuccessApiResponse } from '@/types/common';

export class ProductRepository extends BaseRepository<ProductListItem, FormData, FormData, ProductDetails, ProductDetails> implements IProductRepository {
    constructor(apiClient: AxiosInstance) {
        super(apiClient, '/products');
    }

    /**
     * Override getAll to handle pagination and filtering
     */
    async getAll(params?: {
        limit?: number;
        page?: number;
        sort?: string;
        name?: string;
    }): Promise<PaginatedApiResponse<ProductListItem>> {
        const response = await this.apiClient.get<SuccessApiResponse<PaginatedApiResponse<ProductListItem>>>(
            this.basePath,
            { params }
        );
        return response.data.data;
    }

    /**
     * Get detailed information about a specific product
     */
    async getProductDetails(productId: string): Promise<ProductDetails> {
        const response = await this.apiClient.get<SuccessApiResponse<ProductDetails>>(
            `${this.basePath}/${productId}`
        );
        return response.data.data;
    }

    /**
     * Get products by category with filtering and pagination
     */
    async getByCategory(
        categoryId: number,
        params?: {
            limit?: number;
            page?: number;
            sort?: string;
            filter?: ProductFilterOptions;
        }
    ): Promise<PaginatedApiResponse<ProductListItem>> {
        const response = await this.apiClient.get<SuccessApiResponse<PaginatedApiResponse<ProductListItem>>>(
            `/categories/${categoryId}/products`,
            { params }
        );
        return response.data.data;
    }

    /**
     * Get products that are currently on sale
     */
    async getProductsOnSale(params?: {
        limit?: number;
        page?: number;
        sort?: string;
    }): Promise<PaginatedApiResponse<ProductListItem>> {
        const response = await this.apiClient.get<SuccessApiResponse<PaginatedApiResponse<ProductListItem>>>(
            `${this.basePath}/on-sale`,
            { params }
        );
        return response.data.data;
    }

    /**
     * Override create method to handle FormData
     */
    async create(data: FormData): Promise<ProductDetails> {
        try {
            const response = await this.apiClient.post<SuccessApiResponse<ProductDetails>>(
                this.basePath,
                data,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Override update method to handle FormData
     */
    async update(id: number, data: FormData): Promise<ProductDetails> {
        try {
            const response = await this.apiClient.put<SuccessApiResponse<ProductDetails>>(
                `${this.basePath}/${id}`,
                data,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Handle errors specific to product operations
     */
    protected handleError(error: any): never {
        if (error.response?.status === 404) {
            throw new Error('Product not found');
        }
        if (error.response?.status === 400) {
            throw new Error('Invalid product data');
        }
        if (error.response?.status === 413) {
            throw new Error('Image file size is too large');
        }
        throw error;
    }
}