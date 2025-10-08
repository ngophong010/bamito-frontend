import { Order } from '@/types/order';
import { IBaseRepository } from './IBaseRepository';
import { PaginatedApiResponse } from '@/types/common';
import { CreateOrderDTO, UpdateOrderDTO, UpdateOrderStatusDTO, OrderFilterParams } from '@/types/dtos/order.dto';

export interface IOrderRepository extends IBaseRepository<Order, CreateOrderDTO, UpdateOrderDTO> {
    /**
     * Get orders with filtering and pagination
     * @param params Filtering and pagination parameters
     */
    getOrders(params?: OrderFilterParams): Promise<PaginatedApiResponse<Order>>;

    /**
     * Get orders for a specific user
     * @param userId User ID
     * @param params Pagination parameters
     */
    getUserOrders(
        userId: number,
        params?: Omit<OrderFilterParams, 'userId'>
    ): Promise<PaginatedApiResponse<Order>>;

    /**
     * Update order status
     * @param orderId Order ID
     * @param data Status update data
     */
    updateStatus(orderId: number, data: UpdateOrderStatusDTO): Promise<Order>;

    /**
     * Cancel an order
     * @param orderId Order ID
     * @param reason Cancellation reason
     */
    cancelOrder(orderId: number, reason: string): Promise<Order>;

    /**
     * Get order statistics
     * @param params Date range and other filter parameters
     */
    getOrderStats(params: {
        fromDate?: string;
        toDate?: string;
        status?: string[];
    }): Promise<{
        totalOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
        ordersByStatus: Record<string, number>;
    }>;
}