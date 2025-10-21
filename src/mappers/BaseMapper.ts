/**
 * Base interface for mapping between Domain models and DTOs
 * @template D - Domain model type
 * @template T - DTO type
 */
export interface BaseMapper<D, T> {
    /**
     * Maps a DTO to a domain model
     * @param dto - The DTO to convert
     * @returns The domain model
     */
    toDomain(dto: T): D;

    /**
     * Maps a domain model to a DTO
     * @param domain - The domain model to convert
     * @returns The DTO
     */
    toDTO(domain: D): T;

    /**
     * Maps an array of DTOs to domain models
     * @param dtos - Array of DTOs to convert
     * @returns Array of domain models
     */
    toDomainList(dtos: T[]): D[];
}