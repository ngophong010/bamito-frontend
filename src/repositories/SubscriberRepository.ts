import { AxiosInstance } from 'axios';
import { BaseRepository } from './BaseRepository';
import { 
    SubscriberDTO, 
    SubscriberCreateDTO, 
    SubscriberUpdateDTO, 
    SubscriberFilterParams,
    SubscriberStatsDTO
} from '@/types/dtos/subscriber.dto';
import { PaginatedApiResponse } from '@/types/common';

export class SubscriberRepository extends BaseRepository<SubscriberDTO, SubscriberCreateDTO, SubscriberUpdateDTO> {
    constructor(apiClient: AxiosInstance) {
        super(apiClient, 'subscribers');
    }

    /**
     * Subscribe a new email to the newsletter
     */
    async subscribe(email: string): Promise<SubscriberDTO> {
        const response = await this.apiClient.post(`/${this.basePath}`, { email });
        return response.data.data;
    }

    /**
     * Unsubscribe an email from the newsletter
     */
    async unsubscribe(email: string): Promise<void> {
        await this.apiClient.delete(`/${this.basePath}/unsubscribe`, { data: { email } });
    }

    /**
     * Get subscriber statistics
     */
    async getStats(): Promise<SubscriberStatsDTO> {
        const response = await this.apiClient.get(`/${this.basePath}/stats`);
        return response.data.data;
    }

    /**
     * Export subscribers list as CSV
     */
    async exportToCSV(): Promise<Blob> {
        const response = await this.apiClient.get(`/${this.basePath}/export`, {
            responseType: 'blob'
        });
        return response.data;
    }

    /**
     * Send marketing campaign to all active subscribers
     */
    async sendCampaign(campaignData: { subject: string; content: string }): Promise<void> {
        await this.apiClient.post('/marketing/campaigns/send', campaignData);
    }

    /**
     * Get filtered list of subscribers
     */
    async getSubscribers(params?: SubscriberFilterParams): Promise<PaginatedApiResponse<SubscriberDTO>> {
        return this.getAll(params);
    }

    /**
     * Bulk update subscriber status
     */
    async bulkUpdateStatus(emails: string[], isActive: boolean): Promise<void> {
        await this.apiClient.put(`/${this.basePath}/bulk-status`, {
            emails,
            isActive
        });
    }
}