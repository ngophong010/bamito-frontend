import { AxiosInstance } from 'axios';
import { BaseRepository } from './BaseRepository';
import { Inventory, InventoryCreateData, InventoryUpdateData } from '@/types/inventory';
import { PaginatedApiResponse } from '@/types/common';

export class InventoryRepository extends BaseRepository<Inventory> {
    constructor(apiClient: AxiosInstance) {
        super(apiClient, 'inventory');
    }

    /**
     * Fetches all inventory entries for a specific product.
     */
    async getProductInventory(productId: number): Promise<PaginatedApiResponse<Inventory>> {
        const response = await this.apiClient.get(`/products/${productId}/inventory`);
        return response.data.data;
    }

    /**
     * Creates a new inventory entry for a product.
     */
    async createInventoryEntry(productId: number, data: InventoryCreateData): Promise<Inventory> {
        const response = await this.apiClient.post(`/products/${productId}/inventory`, data);
        return response.data.data;
    }

    /**
     * Updates a specific inventory entry.
     */
    async updateInventoryEntry(id: number, data: InventoryUpdateData): Promise<Inventory> {
        const response = await this.apiClient.put(`/${this.basePath}/${id}`, data);
        return response.data.data;
    }

    /**
     * Updates inventory quantities in bulk.
     */
    async bulkUpdateInventory(updates: { id: number; quantity: number }[]): Promise<void> {
        await this.apiClient.put(`/${this.basePath}/bulk`, { updates });
    }

    /**
     * Gets low stock inventory items.
     */
    async getLowStockInventory(threshold: number = 10): Promise<Inventory[]> {
        const response = await this.apiClient.get(`/${this.basePath}/low-stock`, {
            params: { threshold }
        });
        return response.data.data;
    }
}