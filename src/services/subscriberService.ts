import { PaginatedApiResponse } from '@/types';
import { SubscriberRepository } from '@/repositories/SubscriberRepository';
import { Subscriber, SubscriberStats } from '@/types/models/subscriber';

import apiClient from './apiClient';
import { handleApiError } from '@/utils/errorHandler';
import { SubscriberMapper } from '@/mappers/subscriberMapper';
import { logger } from '@/utils/logger';

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

/**
 * Service class for managing subscribers
 * Implements the Repository pattern and provides error handling
 */
class SubscriberService implements ISubscriberService {
    private readonly repository: SubscriberRepository;
    private readonly mapper: SubscriberMapper;

    constructor() {
        this.repository = new SubscriberRepository(apiClient);
        this.mapper = new SubscriberMapper();
        logger.info('SubscriberService initialized');
    }

    /**
     * Get paginated list of subscribers
     * @param page Current page number (optional)
     * @returns Promise with paginated subscriber data
     */
    public async getSubscribers(page: number = 1): Promise<PaginatedApiResponse<Subscriber>> {
        try {
            logger.debug(`Fetching subscribers page ${page}`);
            const response = await this.repository.getSubscribers({ page });
            return {
                ...response,
                items: this.mapper.toDomainList(response.items)
            };
        } catch (error) {
            logger.error('Failed to fetch subscribers', error as Error);
            throw handleApiError(error, 'Error fetching subscribers');
        }
    }

    /**
     * Delete a subscriber by email
     * @param email Email address to delete
     */
    public async deleteSubscriber(email: string): Promise<void> {
        try {
            logger.info(`Deleting subscriber: ${email}`);
            await this.repository.unsubscribe(email);
        } catch (error) {
            logger.error(`Failed to delete subscriber: ${email}`, error as Error);
            throw handleApiError(error, 'Error deleting subscriber');
        }
    }

    /**
     * Export subscribers list as CSV
     * @returns Promise with Blob data
     */
    public async exportSubscribersAsCsv(): Promise<Blob> {
        try {
            logger.info('Exporting subscribers to CSV');
            return await this.repository.exportToCSV();
        } catch (error) {
            logger.error('Failed to export subscribers', error as Error);
            throw handleApiError(error, 'Error exporting subscribers');
        }
    }

    /**
     * Send marketing campaign to all subscribers
     * @param data Campaign data including subject and content
     */
    public async sendCampaign(data: { subject: string; content: string }): Promise<void> {
        try {
            logger.info(`Sending campaign: ${data.subject}`);
            await this.repository.sendCampaign(data);
        } catch (error) {
            logger.error(`Failed to send campaign: ${data.subject}`, error as Error);
            throw handleApiError(error, 'Error sending campaign');
        }
    }

    /**
     * Subscribe a new email to the newsletter
     * @param email Email address to subscribe
     */
    public async subscribe(email: string): Promise<void> {
        try {
            logger.info(`New subscription request: ${email}`);
            await this.repository.subscribe(email);
        } catch (error) {
            logger.error(`Failed to subscribe: ${email}`, error as Error);
            throw handleApiError(error, 'Error subscribing email');
        }
    }

    /**
     * Unsubscribe an email from the newsletter
     * @param email Email address to unsubscribe
     */
    public async unsubscribe(email: string): Promise<void> {
        try {
            logger.info(`Unsubscribe request: ${email}`);
            await this.repository.unsubscribe(email);
        } catch (error) {
            logger.error(`Failed to unsubscribe: ${email}`, error as Error);
            throw handleApiError(error, 'Error unsubscribing email');
        }
    }

    /**
     * Get subscriber statistics
     * @returns Promise with subscriber statistics
     */
    public async getStats(): Promise<SubscriberStats> {
        try {
            logger.debug('Fetching subscriber statistics');
            const stats = await this.repository.getStats();
            return this.mapper.statsToDomain(stats);
        } catch (error) {
            logger.error('Failed to fetch subscriber statistics', error as Error);
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
            logger.info(`Bulk updating ${emails.length} subscribers to ${isActive ? 'active' : 'inactive'}`);
            await this.repository.bulkUpdateStatus(emails, isActive);
        } catch (error) {
            logger.error('Failed to bulk update subscriber status', error as Error);
            throw handleApiError(error, 'Error updating subscriber status');
        }
    }
}

// Export singleton instance
export const subscriberService = new SubscriberService();

// Export types for use in components
export type { ISubscriberService };
