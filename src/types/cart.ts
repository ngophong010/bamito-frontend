// The shape of a single item in the cart
export interface CartItem {
  productId: string;
  categoryName: string;
  name: string;
  image: string | null;
  sizeId: string;
  sizeName: string;
  price: number;
  discount: number;
  quantity: number; // The quantity the user wants
  totalPrice: number;
  stockQuantity: number; // The available stock
}

// The full response from the GET /cart endpoint
export interface CartData {
  products: CartItem[];
  totalProduct: number;
}

// Data for adding/updating an item
export interface CartItemUpdateData {
  productId: number;
  sizeId: number;
  quantity: number;
}
