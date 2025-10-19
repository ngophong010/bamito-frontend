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
        console.error("Failed to fetch popular searches:", error);
    // Return an empty array on failure so the UI doesn't break
    return []; 
  }
};
