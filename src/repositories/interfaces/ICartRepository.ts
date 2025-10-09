import { CartItem } from '@/types/cart';
import { PaginatedApiResponse } from '@/types/common';
import {
    AddToCartDTO,
    UpdateCartItemDTO,
    CartItemIdentifierDTO,
    CartFilterParams,
    CartSummaryDTO
} from '@/types/dtos/cart.dto';

export interface ICartRepository {
    /**
     * Get cart items for the current user
     */
    getCurrentCart(): Promise<CartSummaryDTO>;

    /**
     * Get cart items for a specific user (admin only)
     */
    getUserCart(userId: number): Promise<CartSummaryDTO>;

    /**
     * Get all carts with filtering and pagination (admin only)
     */
    getCarts(params?: CartFilterParams): Promise<PaginatedApiResponse<CartSummaryDTO>>;

    /**
     * Add an item to the cart
     */
    addItem(data: AddToCartDTO): Promise<CartItem>;

    /**
     * Update cart item quantity
     */
    updateItem(identifiers: CartItemIdentifierDTO, data: UpdateCartItemDTO): Promise<CartItem>;

    /**
     * Remove an item from the cart
     */
    removeItem(identifiers: CartItemIdentifierDTO): Promise<void>;

    /**
     * Clear all items from the cart
     */
    clearCart(): Promise<void>;

    /**
     * Apply a voucher to the cart
     */
    applyVoucher(code: string): Promise<CartSummaryDTO>;

    /**
     * Remove voucher from the cart
     */
    removeVoucher(): Promise<CartSummaryDTO>;

    /**
     * Validate cart items (check stock, prices, etc.)
     */
    validateCart(): Promise<{
        isValid: boolean;
        errors?: {
            productId: number;
            sizeId: number;
            message: string;
        }[];
    }>;
}