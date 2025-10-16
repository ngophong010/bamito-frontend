import { BaseDTO, BaseFilterParams, BaseStatsDTO } from './_base.dto';

export interface SubscriberDTO extends BaseDTO {
    email: string;
    isActive: boolean;
    subscribedAt: string;
    lastEmailSentAt?: string;
    unsubscribedAt?: string;
}

export interface SubscriberCreateDTO {
    email: string;
}

export interface SubscriberUpdateDTO {
    isActive?: boolean;
    lastEmailSentAt?: string;
    unsubscribedAt?: string;
}

export interface SubscriberFilterParams extends BaseFilterParams {
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}

export interface SubscriberStatsDTO extends BaseStatsDTO {
    totalActive: number;
    totalInactive: number;
    newThisMonth: number;
    unsubscribedThisMonth: number;
}