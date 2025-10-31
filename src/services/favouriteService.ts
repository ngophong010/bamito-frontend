import apiClient from './apiClient';
import { FavouriteRepository } from '@/repositories/FavouriteRepository';
import { ProductListItem } from '@/types/product';
import { PaginatedApiResponse } from '@/types/common';

class FavouriteService {
    private readonly repository: FavouriteRepository;

    constructor() {
        this.repository = new FavouriteRepository(apiClient);
    }

    async addFavourite(productId: string | number): Promise<void> {
        return this.repository.addFavourite(productId);
    }

    async removeFavourite(productId: string | number): Promise<void> {
        return this.repository.removeFavourite(productId);
    }

    async getMyFavouriteIds(): Promise<number[]> {
        return this.repository.getFavouriteIds();
    }

    async getMyFavourites(params?: { limit?: number; page?: number }): Promise<PaginatedApiResponse<ProductListItem>> {
        return this.repository.getFavourites(params);
    }
}

export const favouriteService = new FavouriteService();
export const { addFavourite, removeFavourite, getMyFavouriteIds } = favouriteService;
