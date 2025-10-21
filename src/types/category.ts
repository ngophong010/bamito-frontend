/**
 * Represents a product category in the system
 * @interface Category
 */
export interface Category {
  /** Unique identifier */
  id: number;
  /** Business-friendly category ID (e.g., CAT-001) */
  categoryId: string;
  /** Display name of the category */
  name: string;
  /** URL-friendly slug generated from name */
  slug: string;
  /** Optional parent category ID for hierarchical categories */
  parentId?: number;
  /** Optional description for the category */
  description?: string;
  /** Optional image URL for category display */
  imageUrl?: string;
  /** Ordering priority for display */
  displayOrder?: number;
  /** Whether the category is currently active */
  isActive?: boolean;
}

/**
 * Data required when creating a new category
 * @interface CategoryCreateData
 */
export interface CategoryCreateData {
  categoryId: string;
  name: string;
  parentId?: number;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

/**
 * Data allowed when updating an existing category
 * @type CategoryUpdateData
 */
export type CategoryUpdateData = Partial<CategoryCreateData>;
