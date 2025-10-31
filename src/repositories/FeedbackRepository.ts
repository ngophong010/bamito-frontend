import { AxiosInstance } from 'axios';
import { BaseRepository } from './BaseRepository';
import { Feedback, FeedbackCreateData, FeedbackUpdateData } from '@/types/feedback';

export class FeedbackRepository extends BaseRepository<Feedback, FeedbackCreateData, FeedbackUpdateData> {
    constructor(apiClient: AxiosInstance) {
        super(apiClient, 'feedback');
    }

    /**
     * Get all feedback for a specific product
     */
    async getProductFeedback(productId: number): Promise<Feedback[]> {
        const response = await this.apiClient.get(`/products/${productId}/feedback`);
        return response.data.data;
    }

    /**
     * Create feedback for a product
     */
    async createProductFeedback(productId: number, data: FeedbackCreateData): Promise<Feedback> {
        const response = await this.apiClient.post(`/products/${productId}/feedback`, data);
        return response.data.data;
    }

    /**
     * Get products that the logged-in user has purchased but not reviewed
     */
    async getUnreviewedProducts(): Promise<any[]> {
        const response = await this.apiClient.get('/profile/unreviewed-products');
        return response.data.data;
    }

    /**
     * Get the average rating for a product
     */
    async getProductAverageRating(productId: number): Promise<number> {
        const response = await this.apiClient.get(`/products/${productId}/rating`);
        return response.data.data.averageRating;
    }
}
