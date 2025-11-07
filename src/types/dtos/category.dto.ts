export interface CreateCategoryDTO {
    categoryId: string;
    name: string;
    description?: string;
    parentId?: number;
    image?: string;
    isActive?: boolean;
}

export interface UpdateCategoryDTO {
    categoryId?: string;
    name?: string;
    description?: string;
    parentId?: number;
    image?: string;
    isActive?: boolean;
}

export interface CategoryFilterParams {
    search?: string;
    parentId?: number;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
}

export interface CategoryTreeNode {
    id: number;
    categoryId: string;
    name: string;
    description?: string;
    image?: string;
    isActive: boolean;
    parentId?: number;
    children?: CategoryTreeNode[];
    productCount?: number;
}

export interface CategoryStatsDTO {
    totalCategories: number;
    activeCategories: number;
    categoriesWithProducts: number;
    topCategories: {
        id: number;
        name: string;
        productCount: number;
    }[];
}
