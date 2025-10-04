import apiClient from './apiClient';

// ===============================================================
// --- INTERFACES & TYPES ---
// These define the shape of the data for this resource.
// ===============================================================

export interface Category {
  id: number;
  categoryId: string;
  name: string;
}

// The shape of the paginated response from GET /categories
interface CategoriesApiResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  categories: Category[];
}

// The shape of the data needed to create a category
export interface CategoryCreateData {
  categoryId: string;
  name: string;
}

// The shape of the data needed to update a category
export type CategoryUpdateData = Partial<CategoryCreateData>;


// ===============================================================
// --- SERVICE FUNCTIONS ---
// Each function maps to a specific RESTful API endpoint.
// ===============================================================

/**
 * Fetches a paginated and filterable list of all categories.
 * Maps to: GET /api/v1/categories
 * @param params - Optional query parameters for pagination, sorting, and filtering.
 */
export const getAllCategories = async (params?: { limit?: number; page?: number; name?: string; pagination?: boolean }): Promise<CategoriesApiResponse> => {
  const response = await apiClient.get('/categories', { params });
  return response.data.data;
};

/**
 * Fetches a single category by its public-facing string ID.
 * Maps to: GET /api/v1/categories/details/:categoryId
 * @param categoryId - The public business ID of the category (e.g., 'RACKETS').
 */
export const getCategoryById = async (categoryId: string): Promise<Category> => {
  const response = await apiClient.get(`/categories/details/${categoryId}`);
  return response.data.data;
};

/**
 * Creates a new category.
 * Maps to: POST /api/v1/categories
 * @param data - The data for the new category.
 */
export const createCategory = async (data: CategoryCreateData): Promise<Category> => {
  const response = await apiClient.post('/categories', data);
  return response.data.data;
};

/**
 * Updates an existing category by its primary key ID.
 * Maps to: PUT /api/v1/categories/:id
 * @param id - The numeric primary key of the category to update.
 * @param data - The new data for the category.
 */
export const updateCategory = async (id: number, data: CategoryUpdateData): Promise<Category> => {
  const response = await apiClient.put(`/categories/${id}`, data);
  return response.data.data;
};

/**
 * Deletes a category by its primary key ID.
 * Maps to: DELETE /api/v1/categories/:id
 * @param id - The numeric primary key of the category to delete.
 */
export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
