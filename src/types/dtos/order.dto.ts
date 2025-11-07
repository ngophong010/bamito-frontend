import { OrderStatus } from '../order';

export interface CreateOrderDTO {
    payment: string;
    deliveryAddress: string;
    voucherId?: number;
    cartItems: {
        productId: number;
        sizeId: number;
        quantity: number;
    }[];
}

export interface UpdateOrderDTO {
    payment?: string;
    deliveryAddress?: string;
    status?: OrderStatus;
    note?: string;
}

export interface UpdateOrderStatusDTO {
    status: OrderStatus;
    note?: string;
}

export interface OrderFilterParams {
    status?: OrderStatus[];
    fromDate?: string;
    toDate?: string;
    userId?: number;
    page?: number;
    limit?: number;
}
