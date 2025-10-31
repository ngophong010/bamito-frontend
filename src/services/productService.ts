import apiClient from './apiClient';
import { ProductRepository } from '@/repositories/ProductRepository';
import { ProductFilterOptions } from '../repositories/interfaces/IProductRepository';

import { ProductListItem, ProductDetails } from '@/types/product';
import { PaginatedApiResponse } from '@/types/common';
import { Category } from '@/types/category';

class ProductService {
    private readonly repository: ProductRepository;

    constructor() {
        this.repository = new ProductRepository(apiClient);
    }

    /**
     * Fetches a paginated list of all products, with optional sorting and name filtering.
     */
    async getAllProducts(params?: { 
        limit?: number; 
        page?: number; 
        sort?: string; 
        name?: string 
    }): Promise<PaginatedApiResponse<ProductListItem>> {
        return this.repository.getAll(params);
    }

    
    /**
     * Fetches the full details for a single product by its public-facing string ID.
     */
    async getProductDetails(productId: string): Promise<ProductDetails> {
        return this.repository.getProductDetails(productId);
    }

    /**
     * Fetches a paginated and filtered list of products for a specific category.
     */
    async getProductsByCategory(
        categoryId: number,
        params?: { 
            limit?: number; 
            page?: number; 
            sort?: string; 
            filter?: ProductFilterOptions 
        }
    ): Promise<PaginatedApiResponse<ProductListItem>> {
        return this.repository.getByCategory(categoryId, params);
    }


    /**
     * [ADMIN] Creates a new product with an image upload.
     * @param data - A FormData object containing all product fields and the 'image' file.
     */
    async createProduct(data: FormData): Promise<ProductDetails> {
        return this.repository.create(data);
    }

    /**
     * [ADMIN] Updates an existing product by its primary key ID.
     * @param id - The numeric primary key of the product.
     * @param data - A FormData object with the fields to update and an optional 'image' file.
     */
    async updateProduct(id: number, data: FormData): Promise<ProductDetails> {
        return this.repository.update(id, data);
    }

    /**
     * [ADMIN] Deletes a product by its primary key ID.
     * @param id - The numeric primary key of the product.
     */
    async deleteProduct(id: number): Promise<void> {
        return this.repository.delete(id);
    }

    /**
     * Get category details by ID
     * @param categoryId - The category's ID
     */
    async getCategory(categoryId: string): Promise<Category> {
        const response = await apiClient.get(`/categories/${categoryId}`);
        if (response.data.errCode === 0) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch category');
    }

    /**
     * Fetches a paginated list of all products currently on sale.
     */
    async getProductsOnSale(params?: { 
        limit?: number; 
        page?: number; 
        sort?: string 
    }): Promise<PaginatedApiResponse<ProductListItem>> {
        return this.repository.getProductsOnSale(params);
    }
}

// Export a singleton instance
export const productService = new ProductService();
