import apiClient from './apiClient';
import { PaginatedApiResponse, Subscriber } from '@/types'; // Create a Subscriber type

/**
 * Fetches a paginated list of subscribers from the internal API.
 */
export const getSubscribers = async (params: { page?: number; limit?: number }): Promise<PaginatedApiResponse<Subscriber>> => {
    const response = await apiClient.get('/subscribers', { params }); // Assuming you create a /api/subscribers endpoint
    return response.data.data;
};

/**
 * Deletes a subscriber by their email.
 */
export const deleteSubscriber = async (email: string): Promise<void> => {
    await apiClient.delete('/subscribers', { data: { email } });
};

/**
 * Triggers the "send marketing email" campaign.
 */
export const sendCampaign = async (): Promise<void> => {
    await apiClient.post('/marketing/send-campaign');
};

/**
 * Fetches the subscriber list as a CSV file blob.
 */
export const exportSubscribersAsCsv = async (): Promise<Blob> => {
    const response = await apiClient.get('/subscribers/export', {
        responseType: 'blob', // Important: tells Axios to expect a file blob
    });
    return response.data;
};
