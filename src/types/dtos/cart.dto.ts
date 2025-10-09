import { CartItem } from '../cart';

export interface AddToCartDTO {
    productId: number;
    sizeId: number;
    quantity: number;
}

export interface UpdateCartItemDTO {
    quantity: number;
}

export interface CartItemIdentifierDTO {
    productId: number;
    sizeId: number;
}

export interface CartFilterParams {
    userId?: number;
    page?: number;
    limit?: number;
}

export interface CartSummaryDTO {
    totalItems: number;
    subtotal: number;
    discount: number;
    total: number;
    items: CartItem[];
}