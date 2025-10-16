import apiClient from './apiClient';
import { InventoryRepository } from '@/repositories/InventoryRepository';
import { Inventory, InventoryCreateData, InventoryUpdateData } from '@/types/inventory';
import { PaginatedApiResponse } from '@/types/common';

class InventoryService {
    private readonly repository: InventoryRepository;

    constructor() {
        this.repository = new InventoryRepository(apiClient);
    }

    /**
     * Fetches all inventory entries for a specific product.
     */
    async getProductInventory(productId: number): Promise<PaginatedApiResponse<Inventory>> {
        return this.repository.getProductInventory(productId);
    }

    /**
     * Creates a new inventory entry for a product.
     */
    async createInventoryEntry(productId: number, data: InventoryCreateData): Promise<Inventory> {
        return this.repository.createInventoryEntry(productId, data);
    }

    /**
     * Updates a specific inventory entry.
     */
    async updateInventoryEntry(id: number, data: InventoryUpdateData): Promise<Inventory> {
        return this.repository.updateInventoryEntry(id, data);
    }

    /**
     * Deletes a specific inventory entry.
     */
    async deleteInventoryEntry(id: number): Promise<void> {
        return this.repository.delete(id);
    }

    /**
     * Updates multiple inventory entries at once.
     */
    async bulkUpdateInventory(updates: { id: number; quantity: number }[]): Promise<void> {
        return this.repository.bulkUpdateInventory(updates);
    }

    /**
     * Gets inventory items with stock below the specified threshold.
     */
    async getLowStockInventory(threshold: number = 10): Promise<Inventory[]> {
        return this.repository.getLowStockInventory(threshold);
    }
}

// Export a singleton instance
export const inventoryService = new InventoryService();
