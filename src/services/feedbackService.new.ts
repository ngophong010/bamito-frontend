import apiClient from './apiClient';
import { FeedbackRepository } from '@/repositories/FeedbackRepository';
import { Feedback } from '@/types/feedback';

// Types
interface FeedbackCreateData {
    orderId: number;
    sizeId: number;
    rating: number;
    description?: string;
}

type FeedbackUpdateData = Partial<Pick<FeedbackCreateData, 'rating' | 'description'>>;

class FeedbackService {
    private readonly repository: FeedbackRepository;

    constructor() {
        this.repository = new FeedbackRepository(apiClient);
    }

    /**
     * Get all feedback for a specific product
     */
    async getProductFeedback(productId: number): Promise<Feedback[]> {
        return this.repository.getProductFeedback(productId);
    }

    /**
     * Create new feedback for a product
     */
    async createFeedback(productId: number, data: FeedbackCreateData): Promise<Feedback> {
        return this.repository.createProductFeedback(productId, data);
    }

    /**
     * Update existing feedback
     */
    async updateFeedback(id: number, data: FeedbackUpdateData): Promise<Feedback> {
        return this.repository.update(id, data);
    }

    /**
     * Delete feedback
     */
    async deleteFeedback(id: number): Promise<void> {
        return this.repository.delete(id);
    }

    /**
     * Get unreviewed products for the current user
     */
    async getUnreviewedProducts(): Promise<any[]> {
        return this.repository.getUnreviewedProducts();
    }

    /**
     * Get average rating for a product
     */
    async getProductAverageRating(productId: number): Promise<number> {
        return this.repository.getProductAverageRating(productId);
    }
}

// Export a singleton instance
export const feedbackService = new FeedbackService();