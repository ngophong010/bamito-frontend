import apiClient from './apiClient';
import { OrderRepository } from '@/repositories/OrderRepository';
import { Order, OrderStatus, OrderStats } from '@/types/order';
import { PaginatedApiResponse } from '@/types/common';
import { 
    CreateOrderDTO, 
    UpdateOrderDTO, 
    UpdateOrderStatusDTO, 
    OrderFilterParams 
} from '@/types/dtos/order.dto';

interface StatisticsResponse {
    totalIncome: number;
    totalOrder: number;
    totalProduct: number;
    allTotalOrder: { label: string; quantity: number }[];
}

class OrderService {
    private readonly repository: OrderRepository;

    constructor() {
        this.repository = new OrderRepository(apiClient);
    }

    /**
     * [ADMIN] Get all orders with filtering and pagination
     */
    async getAllOrders(params: OrderFilterParams): Promise<PaginatedApiResponse<Order>> {
        return this.repository.getOrders(params);
    }

    /**
     * Get orders for a specific user
     */
    async getUserOrders(
        userId: number,
        params?: Omit<OrderFilterParams, 'userId'>
    ): Promise<PaginatedApiResponse<Order>> {
        return this.repository.getUserOrders(userId, params);
    }

    /**
     * Get detailed information about a specific order
     */
    async getOrderDetails(orderId: number): Promise<Order> {
        return this.repository.getById(orderId);
    }

    /**
     * Create a new order
     */
    async createOrder(data: CreateOrderDTO): Promise<Order> {
        return this.repository.create(data);
    }

    /**
     * Update order details
     */
    async updateOrder(orderId: number, data: UpdateOrderDTO): Promise<Order> {
        return this.repository.update(orderId, data);
    }

    /**
     * Update order status
     */
    async updateOrderStatus(orderId: number, data: UpdateOrderStatusDTO): Promise<Order> {
        return this.repository.updateStatus(orderId, data);
    }

    /**
     * Cancel an order
     */
    async cancelOrder(orderId: number, reason: string): Promise<Order> {
        return this.repository.cancelOrder(orderId, reason);
    }

    /**
     * Get order statistics
     */
    async getOrderStats(params?: { fromDate?: string; toDate?: string; status?: OrderStatus[] }): Promise<OrderStats> {
        return this.repository.getOrderStats(params);
    }

    /**
     * Delete an order (soft delete)
     */
    async deleteOrder(orderId: number): Promise<void> {
        return this.repository.delete(orderId);
    }

    /**
     * Get sales report
     */
    async getSalesReport(params: OrderFilterParams): Promise<PaginatedApiResponse<Order>> {
        return this.repository.getOrders(params);
    }
}

// Export a singleton instance
export const orderService = new OrderService();
