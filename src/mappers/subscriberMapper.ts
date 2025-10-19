import { SubscriberDTO, SubscriberStatsDTO } from '@/types/dtos/subscriber.dto';
import { Subscriber, SubscriberStats } from '@/services/subscriberService';

/**
 * Maps DTO objects to domain models
 */
export const subscriberMapper = {
    /**
     * Convert DTO to domain model
     */
    toDomain(dto: SubscriberDTO): Subscriber {
        return {
            id: dto.id,
            email_address: dto.email,
            bamito_status: dto.status,
            createdAt: dto.createAt,
            updatedAt: dto.updatedAt
        };
    },

    /**
     * Convert stats DTO to domain model
     */
    statsToDomain(dto: SubscriberStatsDTO): SubscriberStats {
        return {
            totalSubscribers: dto.total,
            activeSubscribers: dto.active,
            inactiveSubscribers: dto.inactive,
            subscribersThisMonth: dto.newThisMonth
        };
    },

    /**
     * Convert array of DTOs to domain models
     */
    toDomainList(dtos: SubscriberDTO[]): Subscriber[] {
        return dtos.map(dto => this.toDomain(dto));
    }
};