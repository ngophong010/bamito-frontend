import apiClient from './apiClient';
import { FavouriteRepository } from '@/repositories/FavouriteRepository';
import { Favourite } from '@/types/favourite';
import { PaginatedApiResponse } from '@/types/common';

class FavouriteService {
    private readonly repository: FavouriteRepository;

    constructor() {
        this.repository = new FavouriteRepository(apiClient);
    }

    /**
     * Get paginated list of user's favourites
     */
    async getFavourites(params?: { limit?: number; page?: number }): Promise<PaginatedApiResponse<Favourite>> {
        return this.repository.getFavourites(params);
    }

    /**
     * Get array of favourite product IDs
     */
    async getFavouriteIds(): Promise<number[]> {
        return this.repository.getFavouriteIds();
    }

    /**
     * Add a product to favourites
     */
    async addFavourite(productId: number): Promise<void> {
        return this.repository.addFavourite(productId);
    }

    /**
     * Remove a product from favourites
     */
    async removeFavourite(productId: number): Promise<void> {
        return this.repository.removeFavourite(productId);
    }

    /**
     * Check if a product is in favourites
     */
    async isFavourited(productId: number): Promise<boolean> {
        return this.repository.isFavourited(productId);
    }
}

// Export a singleton instance
export const favouriteService = new FavouriteService();