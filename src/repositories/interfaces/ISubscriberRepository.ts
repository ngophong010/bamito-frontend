import { PaginatedApiResponse } from '@/types';
import { SubscriberDTO, SubscriberCreateDTO, SubscriberUpdateDTO, SubscriberFilterParams, SubscriberStatsDTO } from '@/types/dtos/subscriber.dto';

export interface ISubscriberRepository {
    /**
     * Get a paginated list of subscribers
     */
    getSubscribers(params?: SubscriberFilterParams): Promise<PaginatedApiResponse<SubscriberDTO>>;
    
    /**
     * Get subscriber statistics
     */
    getStats(): Promise<SubscriberStatsDTO>;
    
    /**
     * Subscribe a new email
     */
    subscribe(data: SubscriberCreateDTO): Promise<SubscriberDTO>;
    
    /**
     * Unsubscribe an email
     */
    unsubscribe(email: string): Promise<void>;
    
    /**
     * Export subscribers as CSV
     */
    exportToCSV(): Promise<Blob>;
    
    /**
     * Send marketing campaign
     */
    sendCampaign(data: { subject: string; content: string }): Promise<void>;
    
    /**
     * Bulk update subscriber status
     */
    bulkUpdateStatus(emails: string[], status: SubscriberUpdateDTO['status']): Promise<void>;
}