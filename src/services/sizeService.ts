import apiClient from './apiClient';

// ===============================================================
// --- INTERFACES & TYPES ---
// ===============================================================

export interface Size {
  id: number;
  sizeId: string;
  name: string;
}

interface SizesApiResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  sizes: Size[];
}

export interface SizeCreateData {
    sizeId: string;
    name: string;
    categoryId: number;
}

export type SizeUpdateData = Partial<SizeCreateData>;

// ===============================================================
// --- SERVICE FUNCTIONS ---
// ===============================================================

/**
 * [ADMIN] Fetches a paginated list of all sizes.
 * Maps to: GET /api/v1/sizes
 */
export const getAllSizes = async (params?: { limit?: number; page?: number; name?: string; }): Promise<SizesApiResponse> => {
  const response = await apiClient.get('/sizes', { params });
  return response.data.data;
};

/**
 * [PUBLIC] Fetches all available sizes for a given category.
 * Maps to: GET /api/v1/categories/:categoryId/sizes
 * @param categoryId - The numeric primary key of the category.
 */
export const getSizesByCategory = async (categoryId: number): Promise<Size[]> => {
  const response = await apiClient.get(`/categories/${categoryId}/sizes`);
  return response.data.data;
};

/**
 * [ADMIN] Creates a new size.
 * Maps to: POST /api/v1/sizes
 */
export const createSize = async (data: SizeCreateData): Promise<Size> => {
    const response = await apiClient.post('/sizes', data);
    return response.data.data;
};

/**
 * [ADMIN] Updates a size by its primary key ID.
 * Maps to: PUT /api/v1/sizes/:id
 */
export const updateSize = async (id: number, data: SizeUpdateData): Promise<Size> => {
    const response = await apiClient.put(`/sizes/${id}`, data);
    return response.data.data;
};

/**
 * [ADMIN] Deletes a size by its primary key ID.
 * Maps to: DELETE /api/v1/sizes/:id
 */
export const deleteSize = async (id: number): Promise<void> => {
    await apiClient.delete(`/sizes/${id}`);
};
