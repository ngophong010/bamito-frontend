import apiClient from './apiClient';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { Category } from '@/types/category';
import { PaginatedApiResponse } from '@/types/common';
import {
    CreateCategoryDTO,
    UpdateCategoryDTO,
    CategoryFilterParams,
    CategoryTreeNode,
    CategoryStatsDTO
} from '@/types/dtos/category.dto';

class CategoryService {
    private readonly repository: CategoryRepository;

    constructor() {
        this.repository = new CategoryRepository(apiClient);
    }

    /**
     * Get all categories with filtering and pagination
     */
    async getCategories(params?: CategoryFilterParams): Promise<PaginatedApiResponse<Category>> {
        return this.repository.getCategories(params);
    }

    /**
     * Get all categories as a simple, non-paginated list.
     * Ideal for populating dropdowns and select inputs in the UI.
     */
    async getAllCategoriesList(): Promise<Category[]> {
        // Call the main paginated method, but override the params
        // to ensure we get all items in a single request.
        const response = await this.repository.getCategories({
            limit: 1000, // A high limit to fetch all items
        });
        
        // Return ONLY the array of items, which is what the UI needs.
        return response.items;
    }

    /**
     * Get a category by ID
     */
    async getCategoryById(id: number): Promise<Category> {
        return this.repository.getById(id);
    }

    /**
     * Get a category by its business ID (slug)
     */
    async getCategoryByBusinessId(categoryId: string): Promise<Category> {
        return this.repository.getByBusinessId(categoryId);
    }

    /**
     * Create a new category
     */
    async createCategory(data: CreateCategoryDTO): Promise<Category> {
        return this.repository.create(data);
    }

    /**
     * Update a category
     */
    async updateCategory(id: number, data: UpdateCategoryDTO): Promise<Category> {
        return this.repository.update(id, data);
    }

    /**
     * Delete a category
     */
    async deleteCategory(id: number): Promise<void> {
        return this.repository.delete(id);
    }

    /**
     * Get category tree structure
     */
    async getCategoryTree(includeInactive?: boolean): Promise<CategoryTreeNode[]> {
        return this.repository.getCategoryTree(includeInactive);
    }

    /**
     * Get category statistics
     */
    async getCategoryStats(): Promise<CategoryStatsDTO> {
        return this.repository.getCategoryStats();
    }

    /**
     * Get subcategories of a category
     */
    async getSubcategories(parentId: number): Promise<Category[]> {
        return this.repository.getSubcategories(parentId);
    }

    /**
     * Get breadcrumb path to a category
     */
    async getCategoryBreadcrumb(categoryId: number): Promise<Category[]> {
        return this.repository.getCategoryBreadcrumb(categoryId);
    }

    /**
     * Move a category to a new parent
     */
    async moveCategory(categoryId: number, newParentId?: number): Promise<Category> {
        return this.repository.moveCategory(categoryId, newParentId);
    }

    /**
     * Update category display order
     */
    async updateCategoryOrder(orderedIds: number[]): Promise<void> {
        return this.repository.updateCategoryOrder(orderedIds);
    }

    /**
     * Toggle category active status
     */
    async toggleCategoryStatus(categoryId: number, isActive: boolean): Promise<Category> {
        return this.repository.toggleCategoryStatus(categoryId, isActive);
    }
}

// Export a singleton instance
export const categoryService = new CategoryService();
