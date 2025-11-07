import { AxiosInstance } from 'axios';
import { CartItem } from '@/types/cart';
import { PaginatedApiResponse } from '@/types/common';
import { ICartRepository } from './interfaces/ICartRepository';
import {
    AddToCartDTO,
    UpdateCartItemDTO,
    CartItemIdentifierDTO,
    CartFilterParams,
    CartSummaryDTO
} from '@/types/dtos/cart.dto';
import { handleAxiosError } from './errors/RepositoryError';

export class CartRepository implements ICartRepository {
    private readonly basePath = '/cart';

    constructor(private readonly apiClient: AxiosInstance) {}

    async getCurrentCart(): Promise<CartSummaryDTO> {
        try {
            const response = await this.apiClient.get<{ data: CartSummaryDTO }>('/profile/cart');
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getUserCart(userId: number): Promise<CartSummaryDTO> {
        try {
            const response = await this.apiClient.get<{ data: CartSummaryDTO }>(`/users/${userId}/cart`);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getCarts(params?: CartFilterParams): Promise<PaginatedApiResponse<CartSummaryDTO>> {
        try {
            const response = await this.apiClient.get<{ data: PaginatedApiResponse<CartSummaryDTO> }>(
                this.basePath,
                { params }
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async addItem(data: AddToCartDTO): Promise<CartItem> {
        try {
            const response = await this.apiClient.post<{ data: CartItem }>(
                '/profile/cart/items',
                data
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async updateItem(identifiers: CartItemIdentifierDTO, data: UpdateCartItemDTO): Promise<CartItem> {
        try {
            const response = await this.apiClient.put<{ data: CartItem }>(
                `/profile/cart/items/${identifiers.productId}/${identifiers.sizeId}`,
                data
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async removeItem(identifiers: CartItemIdentifierDTO): Promise<void> {
        try {
            await this.apiClient.delete('/profile/cart/items', {
                data: identifiers
            });
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async clearCart(): Promise<void> {
        try {
            await this.apiClient.delete('/profile/cart');
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async applyVoucher(code: string): Promise<CartSummaryDTO> {
        try {
            const response = await this.apiClient.post<{ data: CartSummaryDTO }>(
                '/profile/cart/voucher',
                { code }
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async removeVoucher(): Promise<CartSummaryDTO> {
        try {
            const response = await this.apiClient.delete<{ data: CartSummaryDTO }>(
                '/profile/cart/voucher'
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async validateCart(): Promise<{
        isValid: boolean;
        errors?: {
            productId: number;
            sizeId: number;
            message: string;
        }[];
    }> {
        try {
            const response = await this.apiClient.post<{
                data: {
                    isValid: boolean;
                    errors?: {
                        productId: number;
                        sizeId: number;
                        message: string;
                    }[];
                };
            }>('/profile/cart/validate');
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }
}
