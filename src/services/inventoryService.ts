import apiClient from './apiClient';

// ===============================================================
// --- INTERFACES & TYPES ---
// ===============================================================

export interface Inventory {
  id: number;
  quantity: number;
  sold: number;
  size: { sizeId: string; name: string; };
}

interface InventoryApiResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  inventory: Inventory[];
}

export interface InventoryCreateData {
    sizeId: number;
    quantity: number;
}

export type InventoryUpdateData = Partial<Pick<InventoryCreateData, 'quantity'>>;

// ===============================================================
// --- SERVICE FUNCTIONS ---
// ===============================================================

/**
 * Fetches all inventory entries for a specific product.
 * Maps to: GET /api/v1/products/:productId/inventory
 * @param productId - The numeric primary key of the product.
 */
export const getInventoryForProduct = async (productId: number): Promise<InventoryApiResponse> => {
  const response = await apiClient.get(`/products/${productId}/inventory`);
  return response.data.data;
};

/**
 * [ADMIN] Creates a new inventory entry for a product.
 * Maps to: POST /api/v1/products/:productId/inventory
 */
export const createInventoryEntry = async (productId: number, data: InventoryCreateData): Promise<Inventory> => {
  const response = await apiClient.post(`/products/${productId}/inventory`, data);
  return response.data.data;
};

/**
 * [ADMIN] Updates a specific inventory entry by its own ID.
 * Maps to: PUT /api/v1/inventory/:id
 */
export const updateInventoryEntry = async (id: number, data: InventoryUpdateData): Promise<Inventory> => {
  const response = await apiClient.put(`/inventory/${id}`, data);
  return response.data.data;
};

/**
 * [ADMIN] Deletes a specific inventory entry by its own ID.
 * Maps to: DELETE /api/v1/inventory/:id
 */
export const deleteInventoryEntry = async (id: number): Promise<void> => {
  await apiClient.delete(`/inventory/${id}`);
};
