import apiClient from './apiClient';
import { SuccessApiResponse } from '@/types'; // Assuming you have this from other services

/**
 * Fetches the list of curated popular search terms from the backend.
 */
export const getPopularSearches = async (): Promise<string[]> => {
    try {
        const response = await apiClient.get<SuccessApiResponse<string[]>>('/search/popular');
        return response.data.data;
    } catch (error) {
        console.warn("Popular searches endpoint not available, using fallback data");
        // Return fallback popular searches for badminton products
        return [
            "Vợt cầu lông",
            "Giày cầu lông",
            "Áo cầu lông",
            "Quần cầu lông",
            "Phụ kiện cầu lông"
        ];
    }
};
