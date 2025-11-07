// Domain Models
export interface Subscriber {
    id: number;
    email: string;
    email_address: string;
    bamito_status: string;
    status: SubscriberStatus;
    createdAt: string;
    updatedAt: string;
}

export interface SubscriberStats {
    totalSubscribers: number;
    activeSubscribers: number;
    inactiveSubscribers: number;
    newThisMonth: number;
}

// Enums
export enum SubscriberStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    UNSUBSCRIBED = 'unsubscribed'
}