import { Size } from "../size";

export interface CreateSizeDTO {
    sizeId: string;
    name: string;
    categoryId: string;
    description?: string;
    order?: number;
    isActive?: boolean;
    measurements?: {
        width?: number;
        height?: number;
        length?: number;
        unit: 'cm' | 'inch';
    };
}

export interface UpdateSizeDTO extends Partial<CreateSizeDTO> {}

export interface SizeFilterParams {
    search?: string;                     // Search by name or ID
    categoryId?: string;                 // Filter by category
    isActive?: boolean;                  // Filter by status
    page?: number;                       // Pagination page number
    limit?: number;                      // Items per page
    sort?: 'name' | 'order' | 'createdAt'; // Sort field
    sortOrder?: 'asc' | 'desc';         // Sort direction
}

export interface SizeStatsDTO {
    totalSizes: number;                  // Total number of sizes
    activeSizes: number;                 // Number of active sizes
    inactiveSizes: number;              // Number of inactive sizes
    sizesByCategory: Record<string, number>; // Distribution by category
    mostUsedSizes: {                    // Most used sizes in orders
        sizeId: string;
        name: string;
        useCount: number;
    }[];
}

export interface SizeWithInventoryDTO extends Size {
    inStock: number;         // Current stock level
    reserved: number;        // Items reserved in pending orders
    available: number;       // Actual available quantity
    lowStockThreshold?: number; // Low stock warning threshold
}

/**
 * Response DTO for size list with statistics
 */
export interface SizeListResponseDTO {
    items: SizeWithInventoryDTO[];
    totalItems: number;
    stats: SizeStatsDTO;
}

/**
 * DTO for bulk size operations
 */
export interface BulkSizeOperationDTO {
    sizeIds: string[];
    operation: 'active' | 'deactivate' | 'delete';
}

/**
 * DTO for size reordering
 */
export interface SizeReorderDTO {
    categoryId: string;
    orders: {
        sizeId: string;
        order: number;
    }[];
}