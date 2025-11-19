// Re-export admin slice and its actions/thunks for convenience
export { default as adminReducer, adminSlice } from './adminSlice';
export * from './adminSlice';
export type { default as AdminState } from './adminSlice';

// Re-export feature slices
export { brandReducer, brandSlice, fetchBrands } from './brand';
export { sizeReducer, sizeSlice, fetchSizes, fetchInventorySizesByCategory } from './size';
export { voucherReducer, voucherSlice, fetchVouchers } from './voucher';
export { roleReducer, roleSlice, fetchRoles } from './role';
export { subscriberReducer, subscriberSlice, fetchSubscribers } from './subscriber';
export { inventoryReducer, inventorySlice } from './inventory';

// Re-export existing sub-slices (using default as reducer, named exports for slice/thunk)
export { default as userAdminReducer } from './users/userAdminSlice';
export { default as productAdminReducer } from './products/productAdminSlice';
export { default as orderAdminReducer } from './orders/orderAdminSlice';
export { default as adminUIReducer } from './shared/adminUISlice';

// Re-export thunks from existing slices
export { fetchUsers as fetchAdminUsers } from './users/userAdminSlice';
export { fetchProducts } from './products/productAdminSlice';

// Re-export types
export type { Subscriber, PaginationParams, TimeRangeParams, AdminUIState, AdminEntities } from './types';
