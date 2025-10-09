import apiClient from './apiClient';
import { CartRepository } from '@/repositories/CartRepository';
import { CartItem } from '@/types/cart';
import { PaginatedApiResponse } from '@/types/common';
import {
    AddToCartDTO,
    UpdateCartItemDTO,
    CartItemIdentifierDTO,
    CartFilterParams,
    CartSummaryDTO
} from '@/types/dtos/cart.dto';

class CartService {
    private readonly repository: CartRepository;

    constructor() {
        this.repository = new CartRepository(apiClient);
    }

    /**
     * Get current user's cart
     */
    async getCart(): Promise<CartSummaryDTO> {
        return this.repository.getCurrentCart();
    }

    /**
     * Add a new item to cart or update quantity if exists
     */
    async addToCart(data: AddToCartDTO): Promise<CartItem> {
        return this.repository.addItem(data);
    }

    /**
     * Update cart item quantity
     */
    async updateCartItem(
        productId: number,
        sizeId: number,
        quantity: number
    ): Promise<CartItem> {
        const identifiers: CartItemIdentifierDTO = { productId, sizeId };
        const data: UpdateCartItemDTO = { quantity };
        return this.repository.updateItem(identifiers, data);
    }

    /**
     * Remove an item from cart
     */
    async removeCartItem(productId: number, sizeId: number): Promise<void> {
        const identifiers: CartItemIdentifierDTO = { productId, sizeId };
        return this.repository.removeItem(identifiers);
    }

    /**
     * Clear all items from cart
     */
    async clearCart(): Promise<void> {
        return this.repository.clearCart();
    }

    /**
     * Apply voucher to cart
     */
    async applyVoucher(code: string): Promise<CartSummaryDTO> {
        return this.repository.applyVoucher(code);
    }

    /**
     * Remove voucher from cart
     */
    async removeVoucher(): Promise<CartSummaryDTO> {
        return this.repository.removeVoucher();
    }

    /**
     * Validate cart before checkout
     */
    async validateCart(): Promise<{
        isValid: boolean;
        errors?: {
            productId: number;
            sizeId: number;
            message: string;
        }[];
    }> {
        return this.repository.validateCart();
    }

    // Admin-only methods
    /**
     * Get cart details for a specific user
     */
    async getUserCart(userId: number): Promise<CartSummaryDTO> {
        return this.repository.getUserCart(userId);
    }

    /**
     * Get all carts with filtering and pagination
     */
    async getAllCarts(params?: CartFilterParams): Promise<PaginatedApiResponse<CartSummaryDTO>> {
        return this.repository.getCarts(params);
    }
}

// Export a singleton instance
export const cartService = new CartService();
