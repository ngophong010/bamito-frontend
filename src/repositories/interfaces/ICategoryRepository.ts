import { Category } from '@/types/category';
import { IBaseRepository } from './IBaseRepository';
import { PaginatedApiResponse } from '@/types/common';
import {
    CreateCategoryDTO,
    UpdateCategoryDTO,
    CategoryFilterParams,
    CategoryTreeNode,
    CategoryStatsDTO
} from '@/types/dtos/category.dto';

export interface ICategoryRepository extends IBaseRepository<Category, CreateCategoryDTO, UpdateCategoryDTO> {
    /**
     * Get categories with filtering and pagination
     */
    getCategories(params?: CategoryFilterParams): Promise<PaginatedApiResponse<Category>>;

    /**
     * Get category by its business ID (slug)
     */
    getByBusinessId(categoryId: string): Promise<Category>;

    /**
     * Get category tree structure
     */
    getCategoryTree(includeInactive?: boolean): Promise<CategoryTreeNode[]>;

    /**
     * Get category statistics
     */
    getCategoryStats(): Promise<CategoryStatsDTO>;

    /**
     * Get direct subcategories of a category
     */
    getSubcategories(parentId: number): Promise<Category[]>;

    /**
     * Get all parent categories of a category
     */
    getCategoryBreadcrumb(categoryId: number): Promise<Category[]>;

    /**
     * Move a category to a new parent
     */
    moveCategory(categoryId: number, newParentId?: number): Promise<Category>;

    /**
     * Bulk update category order/position
     */
    updateCategoryOrder(orderedIds: number[]): Promise<void>;

    /**
     * Toggle category active status
     */
    toggleCategoryStatus(categoryId: number, isActive: boolean): Promise<Category>;
}