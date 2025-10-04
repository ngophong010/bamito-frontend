import { UserProfile } from './user';
import { Voucher } from './voucher';

// The shape of a single item within a detailed order
export interface OrderItem {
  id: number;
  quantity: number;
  price: number; // Snapshot of the price at time of purchase
  productName: string;
  productImage: string | null;
  sizeName: string;
}

// The shape of an Order in a list (summary view)
export interface OrderSummary {
    id: number;
    orderId: string;
    totalPrice: number;
    payment: string;
    status: number;
    createdAt: string;
    user: Pick<UserProfile, 'userName'>;
}

// The shape of a full Order when fetching details
export interface OrderDetails extends Omit<OrderSummary, 'user'> {
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
