import apiClient from './apiClient';
import { OrderSummary, 
    OrderDetails, 
    PaginatedApiResponse, 
    SuccessApiResponse } from '../types'; // Assuming you create a central types file

// ===============================================================
// --- INTERFACES & TYPES ---
// ===============================================================

interface StatisticsResponse {
    totalIncome: number;
    totalOrder: number;
    totalProduct: number;
    allTotalOrder: { label: string; quantity: number }[];
}

interface SalesReportResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    reportItems: OrderDetails[];
}

// ===============================================================
// --- ADMIN-ONLY SERVICE FUNCTIONS ---
// ===============================================================

/**
 * [ADMIN] Fetches a paginated list of all orders, filterable by status.
 * Maps to: GET /api/v1/orders
 */
export const getAllOrders = async (params: { status?: number; limit?: number; page?: number }): Promise<PaginatedApiResponse<OrderSummary>> => {
  const response = await apiClient.get<SuccessApiResponse<PaginatedApiResponse<OrderSummary>>>('/orders', { params });
  return response.data.data;
};

/**
 * [ADMIN] Fetches the full details of a single order by its ID.
 * Maps to: GET /api/v1/orders/:id
 */
export const getOrderDetails = async (id: number): Promise<OrderDetails> => {
  const response = await apiClient.get<SuccessApiResponse<OrderDetails>>(`/orders/${id}`);
  return response.data.data;
};

/**
 * [ADMIN] Updates the status of an order.
 * Maps to: PATCH /api/v1/orders/:id/status
 */
export const updateOrderStatus = async (id: number, status: number): Promise<OrderDetails> => {
  const response = await apiClient.patch<SuccessApiResponse<OrderDetails>>(`/orders/${id}/status`, { status });
  return response.data.data;
};

/**
 * [ADMIN] Soft-deletes an order.
 * Maps to: DELETE /api/v1/orders/:id
 */
export const deleteOrder = async (id: number): Promise<void> => {
  await apiClient.delete(`/orders/${id}`);
};

/**
 * [ADMIN] Fetches sales and user statistics.
 * Maps to: GET /api/v1/statistics
 */
export const getStatistics = async (): Promise<StatisticsResponse> => {
    const response = await apiClient.get('/statistics');
    return response.data.data;
};

/**
 * [ADMIN] Fetches a sales report for a given time period.
 * Maps to: GET /api/v1/reports/sales
 */
export const getSalesReport = async (params: { timeStart: string; timeEnd: string; limit?: number; page?: number }): Promise<SalesReportResponse> => {
    const response = await apiClient.get('/reports/sales', { params });
    return response.data.data;
};
