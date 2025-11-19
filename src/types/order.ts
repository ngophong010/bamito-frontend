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
    order: {
        createdAt: Date;
    };
}

// Lightweight version for list views
export interface OrderSummary extends BaseEntity {
    orderId: string;
    totalPrice: number;
    payment: string;
    status: OrderStatus;
    createdAt: string;
    user: Pick<UserProfile, 'userName' | 'phoneNumber'>;
    itemCount: number; // Total number of items in the order
}

// Detailed version for single order view
export interface OrderDetails extends Omit<OrderSummary, 'itemCount'> {
    deliveryAddress: string;
    voucher: Pick<Voucher, 'voucherId' | 'voucherPrice'> | null;
    items: OrderItem[];
    note?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
    statusHistory?: {
        status: OrderStatus;
        timestamp: string;
        note?: string;
    }[];
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

// Data for updating an order
export interface OrderUpdateData {
    status?: OrderStatus;
    deliveryAddress?: string;
    note?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
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

export interface SalesReportItem {
    productName: string;
    quantity: number;
    price: number;
    order: {
        createdAt: string;
    };
}

export type Order = OrderDetails;
