import { AxiosInstance, AxiosResponse } from 'axios';
import { IBaseRepository } from './interfaces/IBaseRepository';
import { PaginatedApiResponse} from '@/types/common';
import { handleAxiosError } from './errors/RepositoryError';

export abstract class BaseRepository<
T, 
CreateDTO = any, 
UpdateDTO = any, 
CreateResponse = T, 
UpdateResponse = T
> implements IBaseRepository<T, CreateDTO, UpdateDTO, CreateResponse, UpdateResponse> {
    constructor(
        protected readonly apiClient: AxiosInstance,
        protected readonly basePath: string
    ) {}

    async getAll(params?: Record<string, any>): Promise<PaginatedApiResponse<T>> {
        try {
            const response = await this.apiClient.get<{data: PaginatedApiResponse<T>}>(
                this.basePath, 
                { params }
            );
        return response.data.data;
    } catch (error) {
        throw handleAxiosError(error);
    }
    }

    async getById(id: string | number): Promise<T> {
        try {
            const response = await this.apiClient.get<{ data: T }>(`${this.basePath}/${id}`);
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async create(data: CreateDTO): Promise<CreateResponse> {
        try {
            const response = await this.apiClient.post<{ data: CreateResponse }>(
                this.basePath,
                data
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async update(id: string | number, data: UpdateDTO): Promise<UpdateResponse> {
        try {
            const response = await this.apiClient.put<{ data: UpdateResponse }>(
                `${this.basePath}/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async delete(id: string | number): Promise<void> {
        try {
            await this.apiClient.delete(`${this.basePath}/${id}`);
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    protected handleError(error: any): never {
        throw new Error('Validation failed: ' + error.message);
    }
}