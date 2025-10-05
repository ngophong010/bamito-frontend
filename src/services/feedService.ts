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
            // Throw an error if the response is not successful
            throw new Error(`Failed to fetch RSS feed. Status: ${res.status}`);
        }

        const data: RssApiResponse = await res.json();
        
        return data.items;
    } catch (error) {
        console.error("Error in getRssFeed service:", error);
        // Re-throw the error so the calling component can handle it (e.g., in a try/catch block)
        throw error;
    }
};
