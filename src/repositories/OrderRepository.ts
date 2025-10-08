import { AxiosInstance } from 'axios';
import { IBaseRepository } from "./interfaces/IBaseRepository";
import { Order, OrderStatus, OrderStats } from '../types/order';
import { CreateOrderDTO, UpdateOrderDTO, UpdateOrderStatusDTO, OrderFilterParams } from '../types/dtos/order.dto';
import { PaginatedApiResponse } from "@/types/common";

export interface IOrderRepository extends IBaseRepository<Order, CreateOrderDTO, UpdateOrderDTO> {
    getOrders(params?: OrderFilterParams): Promise<PaginatedApiResponse<Order>>;
    getUserOrders(userId: number, params?: Omit<OrderFilterParams, 'userId'>): Promise<PaginatedApiResponse<Order>>;
    getByStatus(status: OrderStatus): Promise<Order[]>;
    updateStatus(id: number, statusData: UpdateOrderStatusDTO): Promise<Order>;
    cancelOrder(id: number, reason: string): Promise<Order>;
    getOrderStats(params?: { fromDate?: string; toDate?: string; status?: OrderStatus[] }): Promise<OrderStats>;
}

export class OrderRepository implements IOrderRepository {
    private readonly basePath = '/orders';

    constructor(private readonly apiClient: AxiosInstance) {}

    async getAll(params?: Record<string, any>): Promise<PaginatedApiResponse<Order>> {
        return this.getOrders(params);
    }

    async getOrders(params?: OrderFilterParams): Promise<PaginatedApiResponse<Order>> {
        const response = await this.apiClient.get(this.basePath, { params });
        return response.data.data;
    }

    async getUserOrders(userId: number, params?: Omit<OrderFilterParams, 'userId'>): Promise<PaginatedApiResponse<Order>> {
        const response = await this.apiClient.get(`/users/${userId}/orders`, { params });
        return response.data.data;
    }

    async getById(id: number): Promise<Order> {
        const response = await this.apiClient.get(`${this.basePath}/${id}`);
        return response.data.data;
    }

    async getByStatus(status: OrderStatus): Promise<Order[]> {
        const response = await this.apiClient.get(`${this.basePath}/status/${status}`);
        return response.data.data;
    }

    async create(data: CreateOrderDTO): Promise<Order> {
        const response = await this.apiClient.post(this.basePath, data);
        return response.data.data;
    }

    async update(id: number, data: UpdateOrderDTO): Promise<Order> {
        const response = await this.apiClient.put(`${this.basePath}/${id}`, data);
        return response.data.data;
    }

    async updateStatus(id: number, statusData: UpdateOrderStatusDTO): Promise<Order> {
        const response = await this.apiClient.patch(`${this.basePath}/${id}/status`, statusData);
        return response.data.data;
    }

    async cancelOrder(id: number, reason: string): Promise<Order> {
        const response = await this.apiClient.post(`${this.basePath}/${id}/cancel`, { reason });
        return response.data.data;
    }

    async delete(id: number): Promise<void> {
        await this.apiClient.delete(`${this.basePath}/${id}`);
    }

    async getOrderStats(params?: { fromDate?: string; toDate?: string; status?: OrderStatus[] }): Promise<OrderStats> {
        const response = await this.apiClient.get(`${this.basePath}/stats`, { params });
        return response.data.data;
    }
}
