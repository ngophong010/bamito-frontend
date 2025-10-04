import apiClient from './apiClient';

// ===============================================================
// --- INTERFACES & TYPES ---
// These define the shape of the data for this resource.
// ===============================================================

// The shape of the data when adding/updating an item in the cart
export interface CartItemData {
  productId: number;
  sizeId: number;
  quantity: number;
}

// The shape of the data for identifying an item to delete
export interface CartItemIdentifiers {
  productId: number;
  sizeId: number;
}

// You should create a more detailed interface for the product object returned by the API
export interface CartProduct {
  productId: string;
  categoryName: string;
  name: string;
  image: string;
  sizeId: string;
  sizeName: string;
  price: number;
  discount: number;
  quantity: number;
  totalPrice: number;
  stockQuantity: number;
}

// The shape of the response from the GET /profile/cart endpoint
interface CartApiResponse {
  products: CartProduct[];
  totalProduct: number;
}


// ===============================================================
// --- SERVICE FUNCTIONS ---
// Each function maps to a specific endpoint on your new, secure backend.
// Notice that NONE of these functions take a `userId`. The backend gets it from the token.
// ===============================================================

/**
 * Fetches all items in the logged-in user's cart.
 * Maps to: GET /api/v1/profile/cart
 */
export const getCart = async (): Promise<CartApiResponse> => {
  const response = await apiClient.get('/profile/cart');
  return response.data.data; // Assuming your backend wraps data in a 'data' property
};

/**
 * Adds a new item to the cart or updates the quantity if it already exists.
 * Maps to: POST /api/v1/profile/cart/items
 * @param data - The product, size, and quantity of the item.
 */
export const addOrUpdateCartItem = async (data: CartItemData): Promise<any> => { // Replace 'any' with the actual return type
  const response = await apiClient.post('/profile/cart/items', data);
  return response.data.data;
};

/**
 * Removes a specific item (product/size combo) from the user's cart.
 * Maps to: DELETE /api/v1/profile/cart/items
 * @param data - The identifiers (productId, sizeId) of the item to remove.
 */
export const removeCartItem = async (data: CartItemIdentifiers): Promise<void> => {
  // For a DELETE request, data is passed in the 'data' property of the config object.
  await apiClient.delete('/profile/cart/items', { data });
};
