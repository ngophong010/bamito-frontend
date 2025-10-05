export interface Category {
  id: number;
  categoryId: string;
  name: string;
}

export interface CategoryCreateData {
  categoryId: string;
  name: string;
}

export type CategoryUpdateData = Partial<CategoryCreateData>;
