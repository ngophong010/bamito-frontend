import { AxiosInstance } from 'axios';
import { IBaseRepository } from './interfaces/IBaseRepository';
import { PaginatedApiResponse as PaginatedResponse } from '@/types/common';

export abstract class BaseRepository<T, CreateDTO = any, UpdateDTO = any, CreateResponse = T, UpdateResponse = T> 
    implements IBaseRepository<T, CreateDTO, UpdateDTO, CreateResponse, UpdateResponse> {
    constructor(
        protected readonly apiClient: AxiosInstance,
        protected readonly endpoint: string
    ) {}

    async getAll(params?: Record<string, any>): Promise<PaginatedResponse<T>> {
        const response = await this.apiClient.get<PaginatedResponse<T>>(this.endpoint, { params });
        return response.data;
    }

    async getById(id: string | number): Promise<T> {
        const response = await this.apiClient.get<T>(`${this.endpoint}/${id}`);
        return response.data;
    }

    async create(data: CreateDTO): Promise<CreateResponse> {
        const response = await this.apiClient.post<CreateResponse>(this.endpoint, data);
        return response.data;
    }

    async update(id: string | number, data: UpdateDTO): Promise<UpdateResponse> {
        const response = await this.apiClient.put<UpdateResponse>(`${this.endpoint}/${id}`, data);
        return response.data;
    }

    async delete(id: string | number): Promise<void> {
        await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    protected handleError(error: any): never {
        // We'll implement this in the error handling step
        throw error;
    }
}