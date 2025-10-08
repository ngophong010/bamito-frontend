import { UserProfile } from './user';
import { Voucher } from './voucher';
import { BaseEntity } from './common';

export enum OrderStatus {
    PENDING = 1,
    PROCESSING = 2,
    SHIPPED = 3,
    DELIVERED = 4,
    CANCELLED = 5,
    REFUNDED = 6
}

// The shape of a single item within an order
export interface OrderItem {
    id: number;
    quantity: number;
    price: number; // Snapshot of the price at time of purchase
    productName: string;
    productImage: string | null;
    sizeName: string;
}

// The core Order interface that extends BaseEntity
export interface Order extends BaseEntity {
    id: number;
    orderId: string;
    totalPrice: number;
    payment: string;
    status: OrderStatus;
    createdAt: string;
    deliveryAddress: string;
    user: Pick<UserProfile, 'userName' | 'phoneNumber'>;
    voucher: Pick<Voucher, 'voucherId' | 'voucherPrice'> | null;
    items: OrderItem[];
}

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

// Order statistics interface
export interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
    dailyOrders: {
        date: string;
        count: number;
        revenue: number;
    }[];
}
