import { Size } from './size';
import { BaseFilterParams } from './dtos/_base.dto';

export interface Inventory {
    id: number;
    productId: number;
    quantity: number;
    sold: number;
    size: Size;
}

export interface InventoryCreateData {
    sizeId: number;
    quantity: number;
}

export interface InventoryUpdateData extends Partial<Pick<InventoryCreateData, 'quantity'>> {}

export interface InventoryFilter extends BaseFilterParams {
    productId?: number;
    sizeId?: number;
    lowStock?: boolean;
    threshold?: number;
}

export interface InventoryStats {
    totalQuantity: number;
    totalSold: number;
    lowStockCount: number;
    outOfStockCount: number;
}
