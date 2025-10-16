import { PaginatedApiResponse } from '@/types/common';

export interface IBaseRepository<T, CreateDTO = any, UpdateDTO = any, CreateResponse = T, UpdateResponse = T> {
    /**
     * Get all records with optional filtering and pagination
     */
    getAll(params?: Record<string, any>): Promise<PaginatedApiResponse<T>>;
    
    /**
     * Get a single record by ID
     */
    getById(id: string | number): Promise<T>;
    
    /**
     * Create a new record
     */
    create(data: CreateDTO): Promise<CreateResponse>;

    /**
     * Update an existing record
     */
    update(id: string | number, data: UpdateDTO): Promise<UpdateResponse>;

    /**
     * Delete a record
     */
    delete(id: string | number): Promise<void>;
}
