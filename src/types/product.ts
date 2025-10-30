import { Brand } from './brand';
import { Category } from './category';
import { Inventory } from './inventory';

// The shape of a Product when fetched in a list
export interface ProductListItem {
  id: number;
  productId: string;
  name: string;
  image: string | null;
  price: number;
  discount: number;
  rating: number; // Calculated average rating
  brand: Pick<Brand, 'brandId' | 'name'>;
  category: Pick<Category, 'categoryId' | 'name'>;
}

// The shape of a Product when fetching full details
export interface ProductDetails extends Omit<ProductListItem, 'rating'> {
    descriptionHTML: string | null;
    inventory: Inventory[];
    averageRating: number;
    feedbackCount: number;
}

export type { ProductCreateData } from './product-create';
export { PRODUCT_VALIDATION_RULES } from './product-create';
