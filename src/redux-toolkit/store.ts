
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
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// 1. Import all your individual slice reducers
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import adminReducer from "./adminSlice";
import searchReducer from "./searchSlice";
import orderReducer from "./profileOrderSlice";
import cartReducer from "./cartSlice";
import feedReducer from "./feedSlice";
import brandReducer from './brandSlice';
import categoryReducer from './categorySlice';
import otpReducer from './otpSlice';
import authReducer from './authSlice';

// 2. Combine all your slice reducers into a single rootReducer
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

// 3. Create the persist configuration
const persistConfig = {
  key: 'root', // The key for the root of your state in localStorage
  storage,
  version: 1,
  // Whitelist: only the 'user' and 'cart' slices will be persisted.
  // All other state (like product lists) will be reset on page refresh.
  whitelist: ['user', 'cart'],
};

// 4. Create the persisted reducer by wrapping the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// 5. Configure the store using the single persisted reducer
export const store = configureStore({
  reducer: persistedReducer, // Use the single persisted reducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // This is recommended for redux-persist to avoid serialization errors
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
