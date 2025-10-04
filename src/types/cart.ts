// src/types/cart.ts

/**
 * @fileoverview Defines all TypeScript interfaces and types related to the Cart resource.
 */

// The shape of a single item returned by the GET /profile/cart API
export interface CartItem {
  productId: string;
  categoryName: string;
  name: string;
  image: string | null;
  sizeId: string;
  sizeName: string;
  price: number;
  discount: number;
  quantity: number; // The quantity the user wants
  totalPrice: number;
  stockQuantity: number; // The available stock for this size
}

// The shape of the full data object returned by the GET /profile/cart API
export interface CartData {
  products: CartItem[];
  totalProduct: number;
}


// --- FIX: ADD THE MISSING TYPES FOR API **INPUT** ---

/**
 * The shape of the data required when sending a POST request to add or update a cart item.
 * Maps to: POST /api/v1/profile/cart/items
 */
export interface CartItemUpdateData {
  productId: number;
  sizeId: number;
  quantity: number;
}

/**
 * The shape of the data required when sending a DELETE request to remove a cart item.
 * Maps to: DELETE /api/v1/profile/cart/items
 */
export interface CartItemIdentifiers {
  productId: number;
  sizeId: number;
}
