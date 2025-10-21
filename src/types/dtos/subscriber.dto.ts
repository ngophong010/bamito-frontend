import { 
    BaseDTO, 
    BaseFilterParams, 
    BaseStatsDTO, 
    DateRange, 
    SoftDeleteDTO 
} from './_base.dto';

/** Possible subscription statuses */
export type SubscriptionStatus = 'active' | 'inactive' | 'unsubscribed';

/**
 * DTO for subscriber data from the API
 */
export interface SubscriberDTO extends BaseDTO, SoftDeleteDTO {
    /** Email address of the subscriber */
    email: string;
    /** Current subscription status */
    status: SubscriptionStatus;
    /** Original subscription date */
    subscribedAt: string;
    /** Last campaign email sent date */
    lastEmailSentAt?: string;
    /** Unsubscribe date if applicable */
    unsubscribedAt?: string;
    /** Email verification status */
    isVerified: boolean;
    /** Source of subscription (e.g., 'website', 'import') */
    source?: string;
    /** Additional metadata */
    metadata?: Record<string, any>;
}

/**
 * Data required to create a new subscriber
 */
export interface SubscriberCreateDTO {
    /** Email address to subscribe */
    email: string;
    /** Optional source tracking */
    source?: string;
    /** Additional metadata */
    metadata?: Record<string, any>;
}

/**
 * Data allowed when updating a subscriber
 */
export interface SubscriberUpdateDTO {
    status?: 'active' | 'inactive' | 'unsubscribed';
    lastEmailSentAt?: string;
    unsubscribedAt?: string;
    metadata?: Record<string, any>;
}

/**
 * Parameters for filtering subscribers
 */
export interface SubscriberFilterParams extends BaseFilterParams, DateRange {
    status?: 'active' | 'inactive' | 'unsubscribed';
    isVerified?: boolean;
    source?: string;
}

/**
 * Statistics about subscribers
 */
export interface SubscriberStatsDTO extends BaseStatsDTO {
    /** Total number of active subscribers */
    totalActive: number;
    /** Total number of inactive subscribers */
    totalInactive: number;
    /** Number of new subscribers this month */
    newThisMonth: number;
    /** Number who unsubscribed this month */
    unsubscribedThisMonth: number;
    /** Growth rate (percentage) */
    monthlyGrowthRate: number;
    /** Email open rate (percentage) */
    averageOpenRate?: number;
    /** Click through rate (percentage) */
    averageClickRate?: number;
    /** Last statistics update time */
    lastUpdated: Date;
}