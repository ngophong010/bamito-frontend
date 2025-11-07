# Cart Slice Usage Guide

## ⚠️ Breaking Changes

The cartSlice has been refactored to remove side effects and improve state structure.

## New State Structure
```typescript
interface CartState {
  items: CartItem[];
  totalCount: number;
  operations: {
    fetch: { status: 'idle' | 'loading' | 'succeeded' | 'failed'; error: string | null; };
    add: { status: 'idle' | 'loading' | 'succeeded' | 'failed'; error: string | null; };
    remove: { status: 'idle' | 'loading' | 'succeeded' | 'failed'; error: string | null; };
  };
}
```

## Before vs After

### Before (Side Effects in Redux)
```typescript
// ❌ Toast notifications in thunks
const handleAddToCart = () => {
  dispatch(addItemToCart(itemData)); // Toast handled in Redux
};
```

### After (Side Effects in Components)
```typescript
// ✅ Side effects in component
const handleAddToCart = async (itemData: CartItemUpdateData) => {
  const result = await dispatch(addItemToCart(itemData));
  
  if (addItemToCart.fulfilled.match(result)) {
    toast.success("Item added to cart!");
  } else if (addItemToCart.rejected.match(result)) {
    toast.error(result.payload || "Failed to add item");
  }
};
```

## Usage Examples

### Cart Component
```typescript
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  fetchCart,
  addItemToCart,
  removeItemFromCart,
  selectCartItems,
  selectCartTotalCount,
  selectCartFetchStatus,
  selectCartAddStatus,
  selectCartRemoveStatus,
  selectCartTotal,
  selectCartIsEmpty
} from '@/lib/redux/features/cart/cartSlice';
import { toast } from 'react-toastify';

const CartComponent = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const items = useAppSelector(selectCartItems);
  const totalCount = useAppSelector(selectCartTotalCount);
  const fetchStatus = useAppSelector(selectCartFetchStatus);
  const addStatus = useAppSelector(selectCartAddStatus);
  const removeStatus = useAppSelector(selectCartRemoveStatus);
  const cartTotal = useAppSelector(selectCartTotal);
  const isEmpty = useAppSelector(selectCartIsEmpty);

  // Load cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleAddItem = async (productId: number, quantity: number, size: number) => {
    const result = await dispatch(addItemToCart({ productId, quantity, size }));
    
    if (addItemToCart.fulfilled.match(result)) {
      toast.success("Item added to cart!");
    } else {
      toast.error("Failed to add item to cart");
    }
  };

  const handleRemoveItem = async (productId: number, size: number) => {
    const result = await dispatch(removeItemFromCart({ productId, size }));
    
    if (removeItemFromCart.fulfilled.match(result)) {
      toast.success("Item removed from cart!");
    } else {
      toast.error("Failed to remove item");
    }
  };

  if (fetchStatus.status === 'loading') {
    return <div>Loading cart...</div>;
  }

  if (isEmpty) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div className="cart">
      <h2>Shopping Cart ({totalCount} items)</h2>
      
      {items.map((item) => (
        <div key={`${item.productId}-${item.size}`} className="cart-item">
          <span>{item.name}</span>
          <span>Quantity: {item.quantity}</span>
          <span>Price: {item.price}</span>
          
          <button 
            onClick={() => handleRemoveItem(item.productId, item.size)}
            disabled={removeStatus.status === 'loading'}
          >
            {removeStatus.status === 'loading' ? 'Removing...' : 'Remove'}
          </button>
        </div>
      ))}
      
      <div className="cart-total">
        Total: {cartTotal.toLocaleString()} VND
      </div>
      
      {fetchStatus.error && (
        <div className="error">Error: {fetchStatus.error}</div>
      )}
      
      {addStatus.error && (
        <div className="error">Add Error: {addStatus.error}</div>
      )}
      
      {removeStatus.error && (
        <div className="error">Remove Error: {removeStatus.error}</div>
      )}
    </div>
  );
};
```

### Product Page Integration
```typescript
const ProductPage = ({ product }) => {
  const dispatch = useAppDispatch();
  const addStatus = useAppSelector(selectCartAddStatus);

  const handleAddToCart = async (size: number, quantity: number = 1) => {
    const result = await dispatch(addItemToCart({
      productId: product.id,
      quantity,
      size
    }));
    
    if (addItemToCart.fulfilled.match(result)) {
      toast.success(`Added ${product.name} to cart!`);
    }
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <button 
        onClick={() => handleAddToCart(product.defaultSize)}
        disabled={addStatus.status === 'loading'}
      >
        {addStatus.status === 'loading' ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};
```

### Cart Badge Component
```typescript
const CartBadge = () => {
  const totalCount = useAppSelector(selectCartTotalCount);
  const fetchStatus = useAppSelector(selectCartFetchStatus);

  return (
    <div className="cart-badge">
      🛒
      {fetchStatus.status === 'succeeded' && totalCount > 0 && (
        <span className="badge">{totalCount}</span>
      )}
    </div>
  );
};
```

## Key Benefits

1. **Granular Loading States**: Separate loading states for each operation
2. **Better Error Handling**: Operation-specific error states
3. **Pure Redux**: No side effects in thunks
4. **Rich Selectors**: Computed values and convenience selectors
5. **Type Safety**: Full TypeScript support
6. **Component Control**: Components handle their own notifications

## Migration Checklist

- [x] Remove toast notifications from thunks
- [x] Separate loading states per operation
- [x] Add comprehensive selectors
- [x] Improve error handling
- [x] Add computed selectors (total, isEmpty)
- [ ] Update components to handle side effects
- [ ] Test all cart operations