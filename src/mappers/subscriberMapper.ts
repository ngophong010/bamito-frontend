import { 
    SubscriberDTO, 
    SubscriberStatsDTO, 
    SubscriptionStatus 
} from '@/types/dtos/subscriber.dto';
import { Subscriber, SubscriberStats } from '@/types/models/subscriber';
import { BaseMapper } from './BaseMapper';
import { ValidationError } from '@/repositories/errors/ValidationError';

/**
 * Mapper for subscriber-related data between DTOs and domain models
 * Used in the e-commerce badminton subscription system
 */
export class SubscriberMapper implements BaseMapper<Subscriber, SubscriberDTO> {
    /**
     * Maps a DTO from the API to our domain model
     * @param dto The subscriber DTO from the API
     * @returns Domain model for internal use
     * @throws {ValidationError} If DTO is missing or invalid
     */
    toDomain(dto: SubscriberDTO): Subscriber {
        if (!dto) {
            throw new ValidationError('DTO is required for subscriber mapping');
        }

        try {
            return {
                id: dto.id,
                emailAddress: dto.email,
                status: dto.status,
                isVerified: dto.isVerified,
                source: dto.source,
                metadata: dto.metadata,
                lastEmailSentAt: dto.lastEmailSentAt ? new Date(dto.lastEmailSentAt) : undefined,
                unsubscribedAt: dto.unsubscribedAt ? new Date(dto.unsubscribedAt) : undefined,
                createdAt: dto.createdAt,
                updatedAt: dto.updatedAt,
                deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined
            };
        } catch (error: any) {
            throw new ValidationError(`Failed to map subscriber DTO: ${error.message}`);
        }
    }

    /**
     * Maps our domain model to a DTO for API responses
     * @param domain The internal domain model
     * @returns DTO for API communication
     * @throws {ValidationError} If domain model is missing or invalid
     */
    toDTO(domain: Subscriber): SubscriberDTO {
        if (!domain) {
            throw new ValidationError('Domain model is required for subscriber mapping');
        }

        try {
            return {
                id: Number(domain.id),
                email: domain.emailAddress,
                status: domain.status,
                isVerified: domain.isVerified,
                source: domain.source,
                metadata: domain.metadata,
                subscribedAt: domain.createdAt.toISOString(),
                lastEmailSentAt: domain.lastEmailSentAt?.toISOString(),
                unsubscribedAt: domain.unsubscribedAt?.toISOString(),
                createdAt: domain.createdAt,
                updatedAt: domain.updatedAt,
                deletedAt: domain.deletedAt?.toISOString()
            };
        } catch (error: any) {
            throw new ValidationError(`Failed to map subscriber domain model: ${error.message}`);
        }
    }

    /**
     * Maps statistics DTO to domain model
     * @param dto The statistics DTO from the API
     * @returns Domain model for statistics
     * @throws {ValidationError} If stats DTO is missing or invalid
     */
    statsToDomain(dto: SubscriberStatsDTO): SubscriberStats {
        if (!dto) {
            throw new ValidationError('Stats DTO is required for mapping');
        }

        try {
            return {
                total: dto.total,
                activeCount: dto.totalActive,
                inactiveCount: dto.totalInactive,
                newThisMonth: dto.newThisMonth,
                unsubscribedThisMonth: dto.unsubscribedThisMonth,
                monthlyGrowthRate: dto.monthlyGrowthRate,
                engagement: {
                    openRate: dto.averageOpenRate ?? 0,
                    clickRate: dto.averageClickRate ?? 0
                },
                lastUpdated: new Date(dto.lastUpdated)
            };
        } catch (error: any) {
            throw new ValidationError(`Failed to map subscriber stats: ${error.message}`);
        }
    }

    /**
     * Maps an array of DTOs to domain models
     * @param dtos Array of subscriber DTOs
     * @returns Array of domain models
     * @throws {ValidationError} If input is not an array
     */
    toDomainList(dtos: SubscriberDTO[]): Subscriber[] {
        if (!Array.isArray(dtos)) {
            throw new ValidationError('Expected array of subscriber DTOs');
        }

        return dtos.map((dto, index) => {
            try {
                return this.toDomain(dto);
            } catch (error: any) {
                throw new ValidationError(`Failed to map subscriber at index ${index}: ${error.message}`);
            }
        });
    }
}