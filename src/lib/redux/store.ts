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

// Combine all your slice reducers into a single rootReducer
const rootReducer = combineReducers({
  user: userReducer,
  brands: brandReducer,
  categories: categoryReducer,
  products: productReducer,
  admin: adminReducer,
  search: searchReducer,
  order: orderReducer,
  cart: cartReducer,
  feed: feedReducer,
  otp: otpReducer,
  auth: authReducer,
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
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Create store instance for client-side usage
export const store = makeStore();
export const persistor = persistStore(store);