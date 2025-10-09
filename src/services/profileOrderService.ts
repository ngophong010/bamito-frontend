// src/services/profileOrderService.ts

import apiClient from './apiClient';
// --- FIX: Import the specific, correct types ---
import { 
    OrderSummary, 
    OrderDetails, 
    PaginatedApiResponse, 
    SuccessApiResponse 
} from '../types';

// ===============================================================
// --- INTERFACES & TYPES ---
// ===============================================================

// Data needed to create an order
export interface OrderCreateData {
    payment: string;
    deliveryAddress: string;
    voucherId?: number;
    cartItems: {
        productId: number;
        sizeId: number;
        quantity: number;
    }[];
}

// ===============================================================
// --- USER-FACING SERVICE FUNCTIONS ---
// ===============================================================

/**
 * Creates a new order for the logged-in user.
 * The backend typically returns the full details of the newly created order.
 * Maps to: POST /api/v1/orders
 */
export const createOrder = async (data: OrderCreateData): Promise<OrderDetails> => {
    // FIX: Expect a SuccessApiResponse containing the OrderDetails
    const response = await apiClient.post<SuccessApiResponse<OrderDetails>>('/orders', data);
    return response.data.data;
};

/**
 * Fetches the order history for the logged-in user.
 * The list view should use the lightweight 'OrderSummary' type.
 * Maps to: GET /api/v1/profile/orders
 */
export const getMyOrders = async (params?: { status?: number; limit?: number; page?: number }): Promise<PaginatedApiResponse<OrderSummary>> => {
  // NO userId is sent. The backend gets it from the token.
  // FIX: Expect a paginated response of OrderSummary objects.
  // Note: Your backend PaginatedData uses 'items', but your local interface used 'orders'. Let's align.
  const response = await apiClient.get<SuccessApiResponse<PaginatedApiResponse<OrderSummary>>>('/profile/orders', { params });
  return response.data.data;
};

/**
 * Fetches the details of a single order belonging to the logged-in user.
 * The detail view should use the rich 'OrderDetails' type.
 * Maps to: GET /api/v1/profile/orders/:id
 */
export const getMyOrderDetails = async (id: number): Promise<OrderDetails> => {
  // FIX: Expect a SuccessApiResponse containing the OrderDetails
  const response = await apiClient.get<SuccessApiResponse<OrderDetails>>(`/profile/orders/${id}`);
  return response.data.data;
};

/**
 * Allows the logged-in user to cancel their own pending order.
 * Maps to: PATCH /api/v1/profile/orders/:id/cancel
 */
export const cancelMyOrder = async (id: number): Promise<{ message: string }> => {
  // This endpoint might just return a success message, which is fine.
  const response = await apiClient.patch(`/profile/orders/${id}/cancel`);
  return response.data;
};
