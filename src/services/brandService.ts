import apiClient from './apiClient';
import { SuccessApiResponse } from '../types';

// ===============================================================
// --- INTERFACES & TYPES ---
// These define the shape of the data for this resource.
// ===============================================================

export interface Brand {
  id: number;
  brandId: string;
  name: string;
}

// The shape of the paginated response from GET /brands
interface BrandsApiResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  brands: Brand[];
}

// The shape of the data needed to create a brand
export interface BrandCreateData {
  brandId: string;
  name: string;
}

// The shape of the data needed to update a brand
// All fields are optional because you might only update one.
export type BrandUpdateData = Partial<BrandCreateData>;


// ===============================================================
// --- SERVICE FUNCTIONS ---
// Each function maps to a specific RESTful API endpoint.
// ===============================================================

/**
 * Fetches a paginated and filterable list of all brands.
 * Maps to: GET /api/v1/brands
 * @param params - Optional query parameters for pagination, sorting, and filtering.
 */
export const getAllBrands = async (params?: { limit?: number; page?: number; name?: string; pagination?: boolean }): Promise<BrandsApiResponse> => {
  // We pass the params object directly to Axios, which will format it as a query string.
  const response = await apiClient.get('/brands', { params });
  
  // Your backend wraps the data in a `data` property, so we extract it here.
  return response.data.data;
};

/**
 * Creates a new brand.
 * Maps to: POST /api/v1/brands
 * @param data - The data for the new brand.
 */
export const createBrand = async (data: BrandCreateData): Promise<Brand> => {
  const response = await apiClient.post('/brands', data);
  return response.data.data;
};

/**
 * Updates an existing brand by its primary key ID.
 * Maps to: PUT /api/v1/brands/:id
 * @param id - The numeric primary key of the brand to update.
 * @param data - The new data for the brand.
 */
export const updateBrand = async (id: number, data: BrandUpdateData): Promise<Brand> => {
  const response = await apiClient.put(`/brands/${id}`, data);
  return response.data.data;
};

/**
 * Deletes a brand by its primary key ID.
 * Maps to: DELETE /api/v1/brands/:id
 * @param id - The numeric primary key of the brand to delete.
 */
export const deleteBrand = async (id: number): Promise<void> => {
  // A successful DELETE request typically returns a 204 No Content status, so we don't expect data back.
  await apiClient.delete(`/brands/${id}`);
};

export const getAllBrandsList = async (): Promise<Brand[]> => {
    const response = await apiClient.get<SuccessApiResponse<Brand[]>>('/brands', { 
        params: { pagination: false } 
    });
    return response.data.data;
};