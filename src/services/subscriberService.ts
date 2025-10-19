import { PaginatedApiResponse } from '@/types';
import { SubscriberRepository } from '@/repositories/SubscriberRepository';
import { 
    SubscriberDTO, 
    SubscriberFilterParams, 
    SubscriberStatsDTO 
} from '@/types/dtos/subscriber.dto';

import apiClient from './apiClient';

interface ISubscriberService {
    getSubscribers(page?: number): Promise<PaginatedApiResponse<Subscriber>>;
    deleteSubscriber(email: string): Promise<void>;
    exportSubscribersAsCsv(): Promise<Blob>;
    sendCampaign(data: { subject: string; content: string }): Promise<void>;
    subscribe(email: string): Promise<void>;
    unsubscribe(email: string): Promise<void>;
    getStats(): Promise<SubscriberStats>;
    bulkUpdateStatus(emails: string[], isActive: boolean): Promise<void>;
}

export interface Subscriber {
    id: number;
    email_address: string;
    bamito_status: string;
    createdAt: string;
    updatedAt: string;
}

export interface SubscriberStats {
    totalSubscribers: number;
    activeSubscribers: number;
    inactiveSubscribers: number;
    subscribersThisMonth: number;
}

/**
 * Service class for managing subscribers
 * Implements the Repository pattern and provides error handling
 */
class SubscriberService implements ISubscriberService {
    private readonly repository: SubscriberRepository;

    constructor() {
        this.repository = new SubscriberRepository(apiClient);
    }

    /**
     * Get paginated list of subscribers
     * @param page Current page number (optional)
     * @returns Promise with paginated subscriber data
     */
    public async getSubscribers(page: number = 1): Promise<PaginatedApiResponse<Subscriber>> {
        try {
            const response = await this.repository.getSubscribers({ page });
            return {
                ...response,
                items: subscriberMapper.toDomainList(response.items)
            };
        } catch (error) {
            throw handleApiError(error, 'Error fetching subscribers');
        }
    }

    /**
     * Delete a subscriber by email
     * @param email Email address to delete
     */
    public async deleteSubscriber(email: string): Promise<void> {
        try {
            await this.repository.unsubscribe(email);
        } catch (error) {
            throw handleApiError(error, 'Error deleting subscriber');
        }
    }

    /**
     * Export subscribers list as CSV
     * @returns Promise with Blob data
     */
    public async exportSubscribersAsCsv(): Promise<Blob> {
        try {
            return await this.repository.exportToCSV();
        } catch (error) {
            throw handleApiError(error, 'Error exporting subscribers');
        }
    }

    /**
     * Send marketing campaign to all subscribers
     * @param data Campaign data including subject and content
     */
    public async sendCampaign(data: { subject: string; content: string }): Promise<void> {
        try {
            await this.repository.sendCampaign(data);
        } catch (error) {
            throw handleApiError(error, 'Error sending campaign');
        }
    }

    /**
     * Subscribe a new email to the newsletter
     * @param email Email address to subscribe
     */
    public async subscribe(email: string): Promise<void> {
        try {
            await this.repository.subscribe(email);
        } catch (error) {
            throw handleApiError(error, 'Error subscribing email');
        }
    }

    /**
     * Unsubscribe an email from the newsletter
     * @param email Email address to unsubscribe
     */
    public async unsubscribe(email: string): Promise<void> {
        try {
            await this.repository.unsubscribe(email);
        } catch (error) {
            throw handleApiError(error, 'Error unsubscribing email');
        }
    }

    /**
     * Get subscriber statistics
     * @returns Promise with subscriber statistics
     */
    public async getStats(): Promise<SubscriberStats> {
        try {
            const stats = await this.repository.getStats();
            return subscriberMapper.statsToDomain(stats);
        } catch (error) {
            throw handleApiError(error, 'Error fetching subscriber statistics');
        }
    }

    /**
     * Bulk update subscriber status
     * @param emails Array of email addresses
     * @param isActive New status
     */
    public async bulkUpdateStatus(emails: string[], isActive: boolean): Promise<void> {
        try {
            await this.repository.bulkUpdateStatus(emails, isActive);
        } catch (error) {
            throw handleApiError(error, 'Error updating subscriber status');
        }
    }
}

// Export singleton instance
export const subscriberService = new SubscriberService();

// Export types for use in components
export type { ISubscriberService };
