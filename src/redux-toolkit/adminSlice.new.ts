import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { LIMIT } from "@/utils";
import { logOut } from "./userSlice";

// Import service factory
import { serviceFactory } from '@/factories';
import type { PaginatedApiResponse } from '@/types';

// Initialize services
const userService = serviceFactory.createUserService();
const productService = serviceFactory.createProductService();
const orderService = serviceFactory.createOrderService();
const voucherService = serviceFactory.createVoucherService();
const brandService = serviceFactory.createBrandService();

// Import types from their respective files
import type { User } from '@/types/user';
import type { Brand } from '@/types/brand';
import type { Order, OrderStatus } from '@/types/order';

// Types and Interfaces
interface ProductReportItem {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  totalQuantity: number;
  totalAmount: number;
}

interface Subscriber {
  email_address: string;
  bamito_status: 'Khách hàng' | 'Ẩn danh';
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Size {
  id: number;
  name: string;
  categoryId: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  brandId: number;
  categoryId: number;
  status: string;
}

interface Voucher {
  id: number;
  code: string;
  discount: number;
  minOrder: number;
  expiryDate: string;
  status: string;
}

// Using imported Order type

interface AdminState {
  entities: {
    subscribers: {
      items: Subscriber[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
    users: PaginatedApiResponse<User>;
    roles: string[];
    brands: PaginatedApiResponse<Brand>;
    categories: PaginatedApiResponse<Category>;
    sizes: PaginatedApiResponse<Size>;
    products: PaginatedApiResponse<Product>;
    inventories: PaginatedApiResponse<any>;
    categorySizes: Size[];
    vouchers: PaginatedApiResponse<Voucher>;
    orders: PaginatedApiResponse<Order>;
    productReport: PaginatedApiResponse<ProductReportItem>;
  };
  ui: {
    loading: Record<string, boolean>;
    errors: Record<string, string | null>;
    searchTextProductAdmin: string | null;
    timeReport: {
      timeStart: number;
      timeEnd: number;
    };
  };
  productData: any;
  dataPost: any[];
}

// Params interfaces
interface PaginationParams {
  page?: number;
  limit?: number;
  filter?: string;
}

interface TimeRangeParams extends PaginationParams {
  timeStart: number;
  timeEnd: number;
}

interface SaleReportItem {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  total: number;
}

interface OrderFilterParams extends PaginationParams {
  status?: OrderStatus[];
  fromDate?: string;
  toDate?: string;
}

// Initial state
const initialState: AdminState = {
  entities: {
    subscribers: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    },
    users: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    },
    roles: [],
    brands: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    },
    categories: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    },
    sizes: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    },
    products: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    },
    inventories: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    },
    categorySizes: [],
    vouchers: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    },
    orders: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    },
    productReport: {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    }
  },
  ui: {
    loading: {},
    errors: {},
    searchTextProductAdmin: null,
    timeReport: {
      timeStart: dayjs(dayjs().startOf("month").toDate()).valueOf(),
      timeEnd: dayjs(dayjs().endOf("month").toDate()).valueOf(),
    }
  },
  productData: {},
  dataPost: []
};

// Thunks
export const fetchUsers = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchUsers",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'users', value: true }));

      const page = params.page || 1;
      const limit = params.limit || LIMIT;
      const search = params.filter || '';

      const response = await userService.getUsers({ page, limit, search });

      dispatch(setUsers({
        items: response.items,
        totalItems: response.totalItems,
        totalPages: Math.ceil(response.totalItems / limit),
        currentPage: page
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch users';
      dispatch(setError({ key: 'users', value: errorMessage }));
      toast.error(errorMessage);
      
      if (error.response?.status === 401) {
        dispatch(logOut());
      }
      
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading({ key: 'users', value: false }));
    }
  }
);

export const fetchBrands = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchBrands",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'brands', value: true }));

      const page = params.page || 1;
      const limit = params.limit || LIMIT;

      const response = await brandService.getBrands({ page, limit });

      dispatch(setBrands({
        items: response.items,
        totalItems: response.totalItems,
        totalPages: Math.ceil(response.totalItems / limit),
        currentPage: page
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch brands';
      dispatch(setError({ key: 'brands', value: errorMessage }));
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading({ key: 'brands', value: false }));
    }
  }
);

export const fetchOrders = createAsyncThunk<
  void,
  OrderFilterParams,
  { rejectValue: string }
>(
  "admin/fetchOrders",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'orders', value: true }));

      const page = params.page || 1;
      const limit = params.limit || LIMIT;
      const status = params.status;

      const response = await orderService.getAllOrders({ page, limit, status });

      dispatch(setOrders({
        items: response.items,
        totalItems: response.totalItems,
        totalPages: Math.ceil(response.totalItems / limit),
        currentPage: page
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch orders';
      dispatch(setError({ key: 'orders', value: errorMessage }));
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading({ key: 'orders', value: false }));
    }
  }
);

export const fetchProductReport = createAsyncThunk<
  void,
  TimeRangeParams,
  { rejectValue: string }
>(
  "admin/fetchProductReport",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: 'productReport', value: true }));

      const { timeStart, timeEnd, page = 1, limit = LIMIT } = params;

      // Mock data for product report since the actual API endpoint is missing
      const mockItems: ProductReportItem[] = [{
        product: {
          id: 1,
          name: "Sample Product",
          price: 99.99,
          image: "/images/default.png"
        },
        totalQuantity: 10,
        totalAmount: 999.90
      }];

      dispatch(adminSlice.actions.setProductReport({
        items: mockItems,
        totalItems: 1,
        totalPages: 1,
        currentPage: page
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch product report';
      dispatch(setError({ key: 'productReport', value: errorMessage }));
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading({ key: 'productReport', value: false }));
    }
  }
);

// Slice
export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<PaginatedApiResponse<User>>) => {
      state.entities.users = action.payload;
    },
    setRoles: (state, action: PayloadAction<string[]>) => {
      state.entities.roles = action.payload;
    },
    setBrands: (state, action: PayloadAction<PaginatedApiResponse<Brand>>) => {
      state.entities.brands = action.payload;
    },
    setCategories: (state, action: PayloadAction<PaginatedApiResponse<Category>>) => {
      state.entities.categories = action.payload;
    },
    setSizes: (state, action: PayloadAction<PaginatedApiResponse<Size>>) => {
      state.entities.sizes = action.payload;
    },
    setProducts: (state, action: PayloadAction<PaginatedApiResponse<Product>>) => {
      state.entities.products = action.payload;
    },
    setVouchers: (state, action: PayloadAction<PaginatedApiResponse<Voucher>>) => {
      state.entities.vouchers = action.payload;
    },
    setOrders: (state, action: PayloadAction<PaginatedApiResponse<Order>>) => {
      state.entities.orders = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.ui.loading[action.payload.key] = action.payload.value;
    },
    setError: (state, action: PayloadAction<{ key: string; value: string | null }>) => {
      state.ui.errors[action.payload.key] = action.payload.value;
    },
    setSearchTextProductAdmin: (state, action: PayloadAction<string | null>) => {
      state.ui.searchTextProductAdmin = action.payload;
    },
    setTimeReport: (state, action: PayloadAction<{ timeStart: number; timeEnd: number }>) => {
      state.ui.timeReport = action.payload;
    },
    setProductReport: (state, action: PayloadAction<PaginatedApiResponse<ProductReportItem>>) => {
      state.entities.productReport = action.payload;
    }
  }
});

// Export actions and reducer
export const {
  setUsers,
  setRoles,
  setBrands,
  setCategories,
  setSizes,
  setProducts,
  setVouchers,
  setOrders,
  setLoading,
  setError,
  setSearchTextProductAdmin,
  setTimeReport
} = adminSlice.actions;

export default adminSlice.reducer;