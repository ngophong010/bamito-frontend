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
export interface ProductDetails extends Omit<ProductListItem, 'rating'> { // 1. Omit the old 'rating'
    descriptionHTML: string | null;
    inventory: Inventory[];
    // 2. Add the more specific properties for the detail view
    averageRating: number;
    feedbackCount: number;
}
