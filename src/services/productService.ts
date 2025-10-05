import apiClient from './apiClient';
// Import all the types you need from your central /types directory
import {
  ProductListItem,
  ProductDetails,
  PaginatedApiResponse,
  SuccessApiResponse
} from '../types';

// ===============================================================
// --- INTERFACES & TYPES (Specific to this service's parameters) ---
// ===============================================================

// Define the shape of the filter object used in getProductsByCategory
export interface ProductFilterOptions {
    brandId?: number[];
    price?: [number, number];
}

// ===============================================================
// --- SERVICE FUNCTIONS ---
// ===============================================================

/**
 * Fetches a paginated list of all products, with optional sorting and name filtering.
 * Maps to: GET /api/v1/products
 */
export const getAllProducts = async (params?: { limit?: number; page?: number; sort?: string; name?: string }): Promise<PaginatedApiResponse<ProductListItem>> => {
  const response = await apiClient.get<SuccessApiResponse<PaginatedApiResponse<ProductListItem>>>('/products', { params });
  return response.data.data;
};

/**
 * Fetches the full details for a single product by its public-facing string ID.
 * Maps to: GET /api/v1/products/:productId
 */
export const getProductDetails = async (productId: string): Promise<ProductDetails> => {
  const response = await apiClient.get<SuccessApiResponse<ProductDetails>>(`/products/${productId}`);
  return response.data.data;
};

/**
 * Fetches a paginated and filtered list of products for a specific category.
 * Maps to: GET /api/v1/categories/:categoryId/products
 */
export const getProductsByCategory = async (
    categoryId: number,
    params?: { limit?: number; page?: number; sort?: string; filter?: ProductFilterOptions }
): Promise<PaginatedApiResponse<ProductListItem>> => {
  const response = await apiClient.get<SuccessApiResponse<PaginatedApiResponse<ProductListItem>>>(`/categories/${categoryId}/products`, { params });
  return response.data.data;
};

/**
 * Fetches a paginated list of all products currently on sale.
 * Maps to: GET /api/v1/products/on-sale
 */
export const getProductsOnSale = async (params?: { limit?: number; page?: number; sort?: string }): Promise<PaginatedApiResponse<ProductListItem>> => {
  const response = await apiClient.get<SuccessApiResponse<PaginatedApiResponse<ProductListItem>>>('/products/on-sale', { params });
  return response.data.data;
};


// ===============================================================
// --- ADMIN-ONLY FUNCTIONS ---
// ===============================================================

/**
 * [ADMIN] Creates a new product with an image upload.
 * Maps to: POST /api/v1/products
 * @param data - A FormData object containing all product fields and the 'image' file.
 */
export const createProduct = async (data: FormData): Promise<ProductDetails> => {
    const response = await apiClient.post<SuccessApiResponse<ProductDetails>>('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
};

/**
 * [ADMIN] Updates an existing product by its primary key ID.
 * Maps to: PUT /api/v1/products/:id
 * @param id - The numeric primary key of the product.
 * @param data - A FormData object with the fields to update and an optional 'image' file.
 */
export const updateProduct = async (id: number, data: FormData): Promise<ProductDetails> => {
    const response = await apiClient.put<SuccessApiResponse<ProductDetails>>(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
};

/**
 * [ADMIN] Deletes a product by its primary key ID.
 * Maps to: DELETE /api/v1/products/:id
 * @param id - The numeric primary key of the product.
 */
export const deleteProduct = async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
};
