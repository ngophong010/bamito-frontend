import { AxiosInstance } from 'axios';
import { BaseRepository } from './BaseRepository';
import { Favourite } from '@/types/favourite';
import { PaginatedApiResponse, SuccessApiResponse } from '@/types/common';

export class FavouriteRepository extends BaseRepository<Favourite> {
    constructor(apiClient: AxiosInstance) {
        super(apiClient, 'favourites');
    }

    /**
     * Get all favourites with optional pagination
     */
    async getFavourites(params?: { limit?: number; page?: number }): Promise<PaginatedApiResponse<Favourite>> {
        const response = await this.apiClient.get<SuccessApiResponse<PaginatedApiResponse<Favourite>>>('/profile/favourites', { params });
        return response.data.data;
    }

    /**
     * Get just the IDs of favourited products
     */
    async getFavouriteIds(): Promise<number[]> {
        const response = await this.apiClient.get<SuccessApiResponse<number[]>>('/profile/favourites/ids');
        return response.data.data;
    }

    /**
     * Add a product to favourites
     */
    async addFavourite(productId: number): Promise<void> {
        await this.apiClient.post(`/${this.basePath}`, { productId });
    }

    /**
     * Remove a product from favourites
     */
    async removeFavourite(productId: number): Promise<void> {
        await this.apiClient.delete(`/${this.basePath}/${productId}`);
    }

    /**
     * Check if a product is favourited
     */
    async isFavourited(productId: number): Promise<boolean> {
        const favouriteIds = await this.getFavouriteIds();
        return favouriteIds.includes(productId);
    }
}