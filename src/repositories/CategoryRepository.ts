import { AxiosInstance } from 'axios';
import { Category } from '@/types/category';
import { ICategoryRepository } from './interfaces/ICategoryRepository';
import { PaginatedApiResponse } from '@/types/common';
import {
    CreateCategoryDTO,
    UpdateCategoryDTO,
    CategoryFilterParams,
    CategoryTreeNode,
    CategoryStatsDTO
} from '@/types/dtos/category.dto';
import { handleAxiosError } from './errors/RepositoryError';

export class CategoryRepository implements ICategoryRepository {
    private readonly basePath = '/categories';

    constructor(private readonly apiClient: AxiosInstance) {}

    async getAll(): Promise<PaginatedApiResponse<Category>> {
        try {
            const response = await this.apiClient.get<{ data: PaginatedApiResponse<Category> }>(
                this.basePath
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getCategories(params?: CategoryFilterParams): Promise<PaginatedApiResponse<Category>> {
        try {
            const response = await this.apiClient.get<{ data: PaginatedApiResponse<Category> }>(
                this.basePath,
                { params }
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getById(id: number): Promise<Category> {
        try {
            const response = await this.apiClient.get<{ data: Category }>(
                `${this.basePath}/${id}`
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getByBusinessId(categoryId: string): Promise<Category> {
        try {
            const response = await this.apiClient.get<{ data: Category }>(
                `${this.basePath}/details/${categoryId}`
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async create(data: CreateCategoryDTO): Promise<Category> {
        try {
            const response = await this.apiClient.post<{ data: Category }>(
                this.basePath,
                data
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async update(id: number, data: UpdateCategoryDTO): Promise<Category> {
        try {
            const response = await this.apiClient.put<{ data: Category }>(
                `${this.basePath}/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.apiClient.delete(`${this.basePath}/${id}`);
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getCategoryTree(includeInactive?: boolean): Promise<CategoryTreeNode[]> {
        try {
            const response = await this.apiClient.get<{ data: CategoryTreeNode[] }>(
                `${this.basePath}/tree`,
                { params: { includeInactive } }
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getCategoryStats(): Promise<CategoryStatsDTO> {
        try {
            const response = await this.apiClient.get<{ data: CategoryStatsDTO }>(
                `${this.basePath}/stats`
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getSubcategories(parentId: number): Promise<Category[]> {
        try {
            const response = await this.apiClient.get<{ data: Category[] }>(
                `${this.basePath}/${parentId}/subcategories`
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async getCategoryBreadcrumb(categoryId: number): Promise<Category[]> {
        try {
            const response = await this.apiClient.get<{ data: Category[] }>(
                `${this.basePath}/${categoryId}/breadcrumb`
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async moveCategory(categoryId: number, newParentId?: number): Promise<Category> {
        try {
            const response = await this.apiClient.patch<{ data: Category }>(
                `${this.basePath}/${categoryId}/move`,
                { parentId: newParentId }
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async updateCategoryOrder(orderedIds: number[]): Promise<void> {
        try {
            await this.apiClient.patch(`${this.basePath}/order`, { orderedIds });
        } catch (error) {
            throw handleAxiosError(error);
        }
    }

    async toggleCategoryStatus(categoryId: number, isActive: boolean): Promise<Category> {
        try {
            const response = await this.apiClient.patch<{ data: Category }>(
                `${this.basePath}/${categoryId}/status`,
                { isActive }
            );
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error);
        }
    }
}