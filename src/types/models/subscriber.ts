import { SubscriptionStatus } from '../dtos/subscriber.dto';

/**
 * Subscriber engagement metrics
 */
export interface SubscriberEngagement {
    /** Email open rate percentage */
    openRate: number;
    /** Click-through rate percentage */
    clickRate: number;
}

/**
 * Core subscriber domain model
 */
export interface Subscriber {
    /** Unique identifier */
    id: number;
    /** Email address */
    emailAddress: string;
    /** Subscription status */
    status: SubscriptionStatus;
    /** Email verification flag */
    isVerified: boolean;
    /** Subscription source */
    source?: string;
    /** Last email campaign sent date */
    lastEmailSentAt?: Date;
    /** Unsubscribe date if applicable */
    unsubscribedAt?: Date;
    /** Additional metadata */
    metadata?: Record<string, any>;
    /** Creation timestamp */
    createdAt: Date;
    /** Last update timestamp */
    updatedAt: Date;
    /** Deletion timestamp */
    deletedAt?: Date;
}

/**
 * Subscriber statistics model
 */
export interface SubscriberStats {
    /** Total number of subscribers */
    total: number;
    /** Number of active subscribers */
    activeCount: number;
    /** Number of inactive subscribers */
    inactiveCount: number;
    /** New subscribers this month */
    newThisMonth: number;
    /** Unsubscribed this month */
    unsubscribedThisMonth: number;
    /** Monthly growth rate percentage */
    monthlyGrowthRate: number;
    /** Engagement metrics */
    engagement: SubscriberEngagement;
    /** Last statistics update time */
    lastUpdated: Date;
}