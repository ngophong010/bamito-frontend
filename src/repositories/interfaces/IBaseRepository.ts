import { PaginatedApiResponse } from '@/types/common';

export interface IBaseRepository<T, CreateDTO = any, UpdateDTO = any, CreateResponse = T, UpdateResponse = T> {
    getAll(params?: Record<string, any>): Promise<PaginatedApiResponse<T>>;
    getById(id: string | number): Promise<T>;
    create(data: CreateDTO): Promise<CreateResponse>;
    update(id: string | number, data: UpdateDTO): Promise<UpdateResponse>;
    delete(id: string | number): Promise<void>;
}
