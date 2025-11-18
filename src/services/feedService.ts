/**
 * @fileoverview This service handles fetching data from the internal RSS feed API route.
 */

import { FeedItem } from '../types'; // Import the type we just created

// Define the shape of the full API response from /api/rss
interface RssApiResponse {
    items: FeedItem[];
    // Include other properties from the rss-parser response if you need them
}

/**
 * Fetches the RSS feed items from the internal Next.js API route.
 * This function is designed to be run on the server (in a Server Component).
 * @returns {Promise<FeedItem[]>} A promise that resolves to an array of feed items.
 * @throws {Error} If the fetch request fails.
 */
export const getRssFeed = async (): Promise<FeedItem[]> => {
    try {
        // Construct the absolute URL to the internal API route.
        // This is necessary when fetching from a Server Component.
        const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/rss`;

        // Use 'no-store' to ensure you get the latest feed on every request.
        // Or use revalidation if you want to cache it for a period.
        const res = await fetch(apiUrl, { cache: 'no-store' });

        if (!res.ok) {
            console.warn(`RSS feed endpoint not available. Status: ${res.status}`);
            return []; // Return empty array instead of throwing
        }

        // Check if response is JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.warn('RSS feed endpoint returned non-JSON response');
            return []; // Return empty array for non-JSON responses
        }

        const data: RssApiResponse = await res.json();
        
        return data.items;
    } catch (error) {
        console.warn("RSS feed service unavailable, returning empty feed:", error);
        // Return empty array instead of throwing to prevent page crashes
        return [];
    }
};
