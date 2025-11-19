# Redux Admin Slices Refactoring

## Overview

The large monolithic `redux-toolkit/adminSlice.ts` has been refactored into smaller, focused modules in `src/lib/redux/features/admin/` following Redux best practices.

## New Modular Structure

```
src/lib/redux/features/admin/
├── types.ts                    # Shared types and interfaces
├── adminSlice.ts               # Legacy admin slice (deprecated)
├── index.ts                    # Main exports
├── brand/
│   ├── brandSlice.ts          # Brand management state
│   └── index.ts
├── size/
│   ├── sizeSlice.ts           # Size management state
│   └── index.ts
├── voucher/
│   ├── voucherSlice.ts        # Voucher management state
│   └── index.ts
├── role/
│   ├── roleSlice.ts           # Role management state
│   └── index.ts
├── subscriber/
│   ├── subscriberSlice.ts     # Email subscriber management
│   └── index.ts
├── inventory/
│   ├── inventorySlice.ts      # Inventory management state
│   └── index.ts
├── users/
│   ├── userAdminSlice.ts      # User management (existing)
│   └── index.ts
├── products/
│   ├── productAdminSlice.ts   # Product management (existing)
│   └── index.ts
├── orders/
│   ├── orderAdminSlice.ts     # Order management (existing)
│   └── index.ts
└── shared/
    ├── adminUISlice.ts        # UI state (existing)
    └── index.ts
```

## Features by Slice

### **brandSlice** - Brand Management
- **State**: Brand list with pagination
- **Thunk**: `fetchBrands(params)`
- **Actions**: 
  - `fetchBrandSuccess(payload)`
  - `fetchBrandFailed()`
  - `setBrandLoading(boolean)`

### **sizeSlice** - Size Management
- **State**: Size list and category sizes with pagination
- **Thunks**: 
  - `fetchSizes(params)` - Fetch all sizes
  - `fetchInventorySizesByCategory(categoryId)` - Fetch sizes for category
- **Actions**:
  - `fetchSizeSuccess(payload)`
  - `fetchSizeOfCategorySuccess(payload)`
  - `setSizeLoading(boolean)`

### **voucherSlice** - Voucher Management
- **State**: Voucher list with pagination
- **Thunk**: `fetchVouchers(params)`
- **Actions**:
  - `fetchVoucherSuccess(payload)`
  - `fetchVoucherFailed()`
  - `setVoucherLoading(boolean)`

### **roleSlice** - Role Management
- **State**: Role list with pagination
- **Thunk**: `fetchRoles(params)`
- **Actions**:
  - `fetchRoleSuccess(payload)`
  - `fetchRoleFailed()`
  - `setRoleLoading(boolean)`

### **subscriberSlice** - Subscriber Management
- **State**: Email subscriber list with pagination
- **Thunk**: `fetchSubscribers(params)` - Fetches from email API with user registration check
- **Actions**:
  - `fetchSubscriberSuccess(payload)`
  - `fetchSubscriberFailed()`
  - `setSubscriberLoading(boolean)`

### **inventorySlice** - Inventory Management
- **State**: Inventory data and product CRUD state
- **Actions**:
  - `fetchInventorySuccess(payload)`
  - `setProductData(data)` - Alias: `CRUDInventory`
  - `updateDataPost(data)` - Alias: `UpdateDataPost`
  - `setInventoryLoading(boolean)`

## Shared Types (`types.ts`)

```typescript
// Entity types
export interface Subscriber {
  email_address: string;
  bamito_status: 'Khách hàng' | 'Ẩn danh';
}

// Parameter types
export interface PaginationParams {
  page?: number;
  limit?: number;
  filter?: string;
}

export interface TimeRangeParams extends PaginationParams {
  timeStart: number;
  timeEnd: number;
}

// UI state
export interface AdminUIState {
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  searchTextProductAdmin: string | null;
  timeReport: { timeStart: number; timeEnd: number };
}
```

## Store Configuration

All new slices are integrated into the Redux store:

```typescript
// In src/lib/redux/store.ts
const rootReducer = combineReducers({
  // ... other reducers
  adminBrands: brandAdminReducer,
  adminSizes: sizeAdminReducer,
  adminVouchers: voucherAdminReducer,
  adminRoles: roleAdminReducer,
  adminSubscribers: subscriberAdminReducer,
  adminInventory: inventoryAdminReducer,
  // ... existing admin slices
});
```

## Backward Compatibility

All new slices include export aliases for backward compatibility:

```typescript
// Brand aliases
export const fetchAllBrandRedux = fetchBrands;

// Size aliases
export const fetchAllSizeRedux = fetchSizes;
export const fetchAllInventoryOfTheCategoryRedux = fetchInventorySizesByCategory;

// Voucher aliases
export const fetchAllVoucherRedux = fetchVouchers;

// Role aliases
export const fetchAllRoleRedux = fetchRoles;

// Subscriber aliases
export const fetchAllSubscriber = fetchSubscribers;

// Inventory aliases
export const CRUDInventory = setProductData;
export const UpdateDataPost = updateDataPost;
```

## Usage Examples

### Dispatching Thunks

```typescript
import { useDispatch } from 'react-redux';
import { fetchBrands, fetchSizes, fetchVouchers } from '@/lib/redux/features/admin';

function AdminPanel() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBrands({ page: 1, limit: 10 }));
    dispatch(fetchSizes({ page: 1 }));
    dispatch(fetchVouchers({ page: 1 }));
  }, [dispatch]);

  // ...
}
```

### Accessing State

```typescript
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux/store';

function BrandList() {
  const brands = useSelector((state: RootState) => state.adminBrands.allBrand);
  const isLoading = useSelector((state: RootState) => state.adminBrands.isLoading);

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <ul>
      {brands.items.map(brand => (
        <li key={brand.id}>{brand.name}</li>
      ))}
    </ul>
  );
}
```

## Migration Notes

1. **Old Path**: `src/redux-toolkit/adminSlice.ts` (deprecated)
2. **New Path**: `src/lib/redux/features/admin/{feature}/`
3. **Imports**: Update all imports to use new paths:
   ```typescript
   // OLD
   import { fetchBrands } from '@/redux-toolkit/adminSlice';
   
   // NEW
   import { fetchBrands } from '@/lib/redux/features/admin/brand';
   ```

4. **State Access**: Update state selectors:
   ```typescript
   // OLD
   state.admin.allBrand
   
   // NEW
   state.adminBrands.allBrand
   ```

## Benefits

✅ **Separation of Concerns** - Each feature has its own slice
✅ **Scalability** - Easy to add new admin features
✅ **Maintainability** - Smaller, focused files are easier to understand
✅ **Code Organization** - Feature-based structure aligns with Redux best practices
✅ **Testability** - Smaller slices are easier to unit test
✅ **Lazy Loading** - Reducers can be added dynamically if needed
✅ **Performance** - More granular state updates

## Next Steps

1. Update all component imports to use new slice paths
2. Update Redux state selectors to use new state keys
3. Remove old `redux-toolkit/` folder once migration is complete
4. Add unit tests for each new slice
5. Consider adding Redux DevTools integration helpers
