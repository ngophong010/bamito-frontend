// src/services/brandService.ts

import apiClient from './apiClient';
// --- THE FIX IS HERE (Step 1: Import the generic types) ---
import { 
    Brand, 
    BrandCreateData, 
    BrandUpdateData, 
    PaginatedApiResponse, 
    SuccessApiResponse 
} from '../types';

// ===============================================================
// --- SERVICE FUNCTIONS ---
// ===============================================================

/**
 * Fetches a paginated and filterable list of all brands.
 * Maps to: GET /api/v1/brands
 */
// --- THE FIX IS HERE (Step 2: Update the return type) ---
// The function now promises to return the generic PaginatedApiResponse of Brand.
export const getAllBrands = async (
    params?: { limit?: number; page?: number; name?: string; pagination?: boolean }
): Promise<PaginatedApiResponse<Brand>> => {
  
  // Tell Axios to expect the generic response type.
  const response = await apiClient.get<SuccessApiResponse<PaginatedApiResponse<Brand>>>('/brands', { params });
  
  // Your backend must return the data in a { data: { items: [...] } } structure.
  return response.data.data;
};

/**
 * Fetches ALL brands as a simple list (not paginated).
 * Maps to: GET /api/v1/brands?pagination=false
 */
export const getAllBrandsList = async (): Promise<Brand[]> => {
    // This endpoint returns a simple array of Brands.
    const response = await apiClient.get<SuccessApiResponse<Brand[]>>('/brands', { 
        params: { pagination: 'false' } // Query params are strings
    });
    return response.data.data;
};

/**
 * [ADMIN] Fetches a single brand by its primary key ID.
 * Maps to: GET /api/v1/brands/:id
 */
export const getBrandById = async (id: number): Promise<Brand> => {
    const response = await apiClient.get<SuccessApiResponse<Brand>>(`/brands/${id}`);
    return response.data.data;
};

/**
 * [ADMIN] Creates a new brand.
 * Maps to: POST /api/v1/brands
 */
export const createBrand = async (data: BrandCreateData): Promise<Brand> => {
  const response = await apiClient.post<SuccessApiResponse<Brand>>('/brands', data);
  return response.data.data;
};

/**
 * [ADMIN] Updates an existing brand by its primary key ID.
 * Maps to: PUT /api/v1/brands/:id
 */
export const updateBrand = async (id: number, data: BrandUpdateData): Promise<Brand> => {
  const response = await apiClient.put<SuccessApiResponse<Brand>>(`/brands/${id}`, data);
  return response.data.data;
};

/**
 * [ADMIN] Deletes a brand by its primary key ID.
 * Maps to: DELETE /api/v1/brands/:id
 */
export const deleteBrand = async (id: number): Promise<void> => {
  await apiClient.delete(`/brands/${id}`);
};
