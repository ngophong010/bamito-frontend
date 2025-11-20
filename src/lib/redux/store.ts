import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import all your individual slice reducers
import userReducer from "./features/user/userSlice";
import productReducer from "./features/product/productSlice";
import adminReducer from "./features/admin/adminSlice";
import searchReducer from "./features/search/searchSlice";
import orderReducer from "./features/order/profileOrderSlice";
import cartReducer from "./features/cart/cartSlice";
import feedReducer from "./features/feeds/feedSlice";
import brandReducer from './features/brand/brandSlice';
import categoryReducer from './features/category/categorySlice';
import otpReducer from './features/auth/otpSlice';
import authReducer from './features/auth/authSlice';

// New focused admin slices
import userAdminReducer from './features/admin/users/userAdminSlice';
import productAdminReducer from './features/admin/products/productAdminSlice';
import orderAdminReducer from './features/admin/orders/orderAdminSlice';
import adminUIReducer from './features/admin/shared/adminUISlice';
import brandAdminReducer from './features/admin/brand/brandSlice';
import sizeAdminReducer from './features/admin/size/sizeSlice';
import voucherAdminReducer from './features/admin/voucher/voucherSlice';
import roleAdminReducer from './features/admin/role/roleSlice';
import subscriberAdminReducer from './features/admin/subscriber/subscriberSlice';
import inventoryAdminReducer from './features/admin/inventory/inventorySlice';

// Combine all your slice reducers into a single rootReducer
const rootReducer = combineReducers({
  user: userReducer,
  brands: brandReducer,
  categories: categoryReducer,
  products: productReducer,
  admin: adminReducer, // Legacy - will be removed
  search: searchReducer,
  order: orderReducer,
  cart: cartReducer,
  feed: feedReducer,
  otp: otpReducer,
  auth: authReducer,
  
  // New focused admin slices
  adminUsers: userAdminReducer,
  adminProducts: productAdminReducer,
  adminOrders: orderAdminReducer,
  adminUI: adminUIReducer,
  adminBrands: brandAdminReducer,
  adminSizes: sizeAdminReducer,
  adminVouchers: voucherAdminReducer,
  adminRoles: roleAdminReducer,
  adminSubscribers: subscriberAdminReducer,
  adminInventory: inventoryAdminReducer,
});

// Create the persist configuration
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['user', 'cart'],
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store factory function for Next.js App Router
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Root state should reflect the shape of the combined reducers, not the persisted wrapper
export type RootState = ReturnType<typeof rootReducer>;
// Infer the `AppDispatch` type from the store
export type AppDispatch = AppStore['dispatch'];

// Create store instance for client-side usage
export const store = makeStore();
export const persistor = persistStore(store);
