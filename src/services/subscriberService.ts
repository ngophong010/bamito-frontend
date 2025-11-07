import apiClient from './apiClient';
import { SubscriberRepository } from '@/repositories/SubscriberRepository';
import { SubscriberMapper } from '@/mappers/subscriberMapper';
import { handleApiError } from '@/lib/utils/errorHandler';
import { logger } from '@/lib/utils/logger';
import { PaginatedApiResponse } from '@/types/common';
import { Subscriber, SubscriberStats } from '@/types/models/subscriber';
import { SubscriberFilterParams } from '@/types/dtos/subscriber.dto';

interface ISubscriberService {
  getSubscribers(params?: SubscriberFilterParams): Promise<PaginatedApiResponse<Subscriber>>;
  deleteSubscriber(email: string): Promise<void>;
  sendCampaign(data: { subject: string; content: string }): Promise<void>;
  exportSubscribersAsCsv(): Promise<Blob>;
  subscribe(email: string): Promise<void>;
  unsubscribe(email: string): Promise<void>;
  getStats(): Promise<SubscriberStats>;
}

/**
 * Service class for managing subscribers
 * Implements the Repository pattern with proper error handling
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
   * @param params Filter and pagination parameters
   * @returns Promise with paginated subscriber data
   */
  public async getSubscribers(params?: SubscriberFilterParams): Promise<PaginatedApiResponse<Subscriber>> {
    try {
      logger.debug('Fetching subscribers', params);
      const response = await this.repository.getSubscribers(params);
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
   * Send marketing campaign to subscribers
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
}

// Export singleton instance
export const subscriberService = new SubscriberService();

// Export types for use in components
export type { ISubscriberService };

// Legacy exports for backward compatibility
export const getSubscribers = subscriberService.getSubscribers.bind(subscriberService);
export const deleteSubscriber = subscriberService.deleteSubscriber.bind(subscriberService);
export const sendCampaign = subscriberService.sendCampaign.bind(subscriberService);
export const exportSubscribersAsCsv = subscriberService.exportSubscribersAsCsv.bind(subscriberService);
