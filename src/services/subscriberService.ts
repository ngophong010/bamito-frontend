import apiClient from './apiClient';
import { SubscriberRepository } from '@/repositories/SubscriberRepository';
import { 
    SubscriberDTO, 
    SubscriberFilterParams, 
    SubscriberStatsDTO 
} from '@/types/dtos/subscriber.dto';
import { PaginatedApiResponse } from '@/types/common';

class SubscriberService {
    private readonly repository: SubscriberRepository;

    constructor() {
        this.repository = new SubscriberRepository(apiClient);
    }

    /**
     * Subscribe a new email to the newsletter
     */
    async subscribeEmail(email: string): Promise<SubscriberDTO> {
        return this.repository.subscribe(email);
    }

    /**
     * Unsubscribe an email from the newsletter
     */
    async unsubscribeEmail(email: string): Promise<void> {
        return this.repository.unsubscribe(email);
    }

    /**
     * Get paginated list of subscribers
     */
    async getSubscribers(params?: SubscriberFilterParams): Promise<PaginatedApiResponse<SubscriberDTO>> {
        return this.repository.getSubscribers(params);
    }

    /**
     * Get subscriber statistics
     */
    async getSubscriberStats(): Promise<SubscriberStatsDTO> {
        return this.repository.getStats();
    }

    /**
     * Export subscribers as CSV
     */
    async exportSubscribers(): Promise<Blob> {
        return this.repository.exportToCSV();
    }

    /**
     * Send marketing campaign
     */
    async sendMarketingCampaign(campaignData: { subject: string; content: string }): Promise<void> {
        return this.repository.sendCampaign(campaignData);
    }

    /**
     * Delete a subscriber
     */
    async deleteSubscriber(id: number): Promise<void> {
        return this.repository.delete(id);
    }

    /**
     * Bulk update subscriber status
     */
    async bulkUpdateSubscriberStatus(emails: string[], isActive: boolean): Promise<void> {
        return this.repository.bulkUpdateStatus(emails, isActive);
    }
}

// Export a singleton instance
export const subscriberService = new SubscriberService();