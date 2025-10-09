import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { logOut } from "./userSlice";
import { LIMIT } from "@/utils";

// Import the service factory
import { serviceFactory } from '@/factories';
import type { PaginatedApiResponse } from '@/types';

// Entity interfaces (lightweight for slice typing)
interface Subscriber {
  email_address: string;
  bamito_status: 'Khách hàng' | 'Ẩn danh';
}

interface AdminState {
  // New, normalized container
  entities: {
    subscribers: PaginatedApiResponse<Subscriber>;
    users: PaginatedApiResponse<any>;
    roles: any[];
    brands: PaginatedApiResponse<any>;
    categories: PaginatedApiResponse<any>;
    sizes: PaginatedApiResponse<any>;
    products: PaginatedApiResponse<any>;
    inventories: PaginatedApiResponse<any>;
    categorySizes: any[];
    vouchers: PaginatedApiResponse<any>;
    orders: PaginatedApiResponse<any>;
    productOrders: PaginatedApiResponse<any>;
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

  // Legacy top-level fields kept for backward-compatibility with existing selectors
  isLoading: boolean;
  allSubscriber: any;
  allUser: any;
  allRole: any;
  allBrand: any;
  allCategory: any;
  allSize: any;
  allProduct: any;
  allInventory: any;
  allInventoryOfTheCategory: any;
  allVoucher: any;
  allOrder: any;
  allProductOrder: any;

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

// Initialize services
const userService = serviceFactory.createUserService();
const productService = serviceFactory.createProductService();
const orderService = serviceFactory.createOrderService();
const voucherService = serviceFactory.createVoucherService();
const brandService = serviceFactory.createBrandService();
const categoryService = serviceFactory.createCategoryService();
const sizeService = serviceFactory.createSizeService();
const inventoryService = serviceFactory.createInventoryService();

const emptyPage = { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };

const initialState: AdminState = {
  entities: {
    subscribers: { ...emptyPage },
    users: { ...emptyPage },
    roles: [],
    brands: { ...emptyPage },
    categories: { ...emptyPage },
    sizes: { ...emptyPage },
    products: { ...emptyPage },
    inventories: { ...emptyPage },
    categorySizes: [],
    vouchers: { ...emptyPage },
    orders: { ...emptyPage },
    productOrders: { ...emptyPage }
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

  // Legacy fields initialized to preserve runtime stability
  isLoading: false,
  allSubscriber: { ...emptyPage },
  allUser: { ...emptyPage },
  allRole: [],
  allBrand: { ...emptyPage },
  allCategory: { ...emptyPage },
  allSize: { ...emptyPage },
  allProduct: { ...emptyPage },
  allInventory: { ...emptyPage },
  allInventoryOfTheCategory: { ...emptyPage },
  allVoucher: { ...emptyPage },
  allOrder: { ...emptyPage },
  allProductOrder: { ...emptyPage },

  productData: {},
  dataPost: []
};

// Thunks (refactored naming) -----------------------------------------------
export const fetchSubscribers = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchSubscribers",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const page = params.page || 1;
      const limit = params.limit || LIMIT;
      const res = await fetch(
        `/api/email?offset=${(page - 1) * limit}&count=${limit}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch subscribers');
      }

      const result = await res.json();
      const totalPages = Math.ceil(result.total_items / LIMIT);

      const members = await Promise.all(
        result.members.map(async (member: { email_address: string }) => {
          const emailStatus = await userService.isEmailRegistered(member.email_address);
          return {
            ...member,
            bamito_status: emailStatus ? "Khách hàng" : "Ẩn danh",
          } as Subscriber;
        })
      );

      const payload = {
        items: members,
        totalItems: result.total_items,
        totalPages,
        currentPage: page
      };

      dispatch(fetchAllSubscriberSuccess(payload));
    } catch (error: any) {
      console.error('Failed to fetch subscribers:', error);
      return rejectWithValue(error.message || 'Failed to fetch subscribers');
    }
  }
);

export const fetchUsers = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchUsers",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const page = params.page || 1;
      const limit = params.limit || LIMIT;

      const response = await userService.getUsers({ page, limit });

      const payload = {
        items: response.items,
        totalItems: response.totalItems,
        totalPages: Math.ceil(response.totalItems / limit),
        currentPage: page
      };
      dispatch(fetchAllUserSuccess(payload));
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch users';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Session expired, please login again");
        dispatch(logOut());
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRoles = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchRoles",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      // NOTE: userService.getAllRole does not exist in the current codebase.
      // To keep the app stable, we deliver an empty roles payload.
      const page = params.page || 1;
      const limit = params.limit || LIMIT;
      dispatch(fetchAllRoleSuccess({
        items: [],
        totalItems: 0,
        totalPages: Math.ceil(0 / limit),
        currentPage: page,
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch roles';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      }

      return rejectWithValue(errorMessage);
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
      const page = params.page || 1;
      const limit = params.limit || LIMIT;

      const res = await brandService.getBrands({ page, limit });

      dispatch(fetchAllBrandSuccess({
        items: res.items,
        totalItems: res.totalItems,
        totalPages: Math.ceil(res.totalItems / limit),
        currentPage: page
      }));

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch brands';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCategories = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchCategories",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const page = params.page || 1;
      const limit = params.limit || LIMIT;

      const res = await categoryService.getCategories({ page, limit });
      dispatch(fetchAllCategorySuccess({
        items: res.items,
        totalItems: res.totalItems,
        totalPages: Math.ceil(res.totalItems / limit),
        currentPage: page
      }));

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch categories';
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSizes = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchSizes",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const page = params.page || 1;
      const limit = params.limit || LIMIT;

      const res = await sizeService.getAllSize(
        { page, limit }
      );

      dispatch(fetchAllSizeSuccess({
        items: res.items,
        totalItems: res.totalItems,
        totalPages: Math.ceil(res.totalItems / limit),
        currentPage: page
      }));

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch sizes';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Session expired, please login again");
        dispatch(logOut());
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProducts = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchProducts",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const page = params.page || 1;
      const limit = params.limit || LIMIT;

      const res = await productService.getAllProducts(
        { page, limit }
      );

      dispatch(fetchAllProductSuccess({
        items: res.items,
        totalItems: res.totalItems,
        totalPages: Math.ceil(res.totalItems / limit),
        currentPage: page
      }));

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch products';
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchVouchers = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchVouchers",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const page = params.page || 1;
      const limit = params.limit || LIMIT;

      const res = await voucherService.getAllVouchers(
        { page, limit }
      );

      dispatch(fetchAllVoucherSuccess({
        items: res.items,
        totalItems: res.totalItems,
        totalPages: Math.ceil(res.totalItems / limit),
        currentPage: page
      }));

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch vouchers';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOrders = createAsyncThunk<
  void,
  PaginationParams,
  { rejectValue: string }
>(
  "admin/fetchOrders",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const page = params.page || 1;
      const limit = params.limit || LIMIT;

      const res = await orderService.getAllOrders(
        { page, limit } as any
      );
      dispatch(fetchAllOrderSuccess({
        items: res.items,
        totalItems: res.totalItems,
        totalPages: Math.ceil(res.totalItems / limit),
        currentPage: page
      }));

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch orders';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      }

      return rejectWithValue(errorMessage);
    }
  }
);

// Fix bugged thunk (no params available previously). Use categoryId only
export const fetchInventorySizesByCategory = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>(
  "admin/fetchInventorySizesByCategory",
  async (categoryId, { dispatch, rejectWithValue }) => {
    try {
      const res = await sizeService.getAllSizeOfTheCategory(categoryId);
      dispatch(
        fetchAllInventoryOfTheCategorySuccess({
          items: res.items,
          totalItems: res.totalItems,
          totalPages: 1,
          currentPage: 1
        })
      );

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch category sizes';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      }

      return rejectWithValue(errorMessage);
    }
  }
);

// Slice ---------------------------------------------------------------------
export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Keep the old action name for compatibility
    loadingAdmin: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.ui.loading["global"] = action.payload;
    },

    // Success/Failed reducers (now also update normalized entities)
    fetchAllSubscriberSuccess: (state, action: PayloadAction<PaginatedApiResponse<Subscriber>>) => {
      state.allSubscriber = action.payload;
      state.entities.subscribers = action.payload;
    },
    fetchAllSubscriberFailed: (state) => {
      state.allSubscriber = [] as any;
      state.entities.subscribers = { ...emptyPage };
    },

    fetchAllUserSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allUser = action.payload;
      state.entities.users = action.payload;
    },
    fetchAllUserFailed: (state) => {
      state.allUser = [] as any;
      state.entities.users = { ...emptyPage };
    },

    fetchAllRoleSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allRole = action.payload;
      state.entities.roles = action.payload.items;
    },
    fetchAllRoleFailed: (state) => {
      state.allRole = [] as any;
      state.entities.roles = [];
    },

    fetchAllBrandSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allBrand = action.payload;
      state.entities.brands = action.payload;
    },
    fetchAllBrandFailed: (state) => {
      state.allBrand = [] as any;
      state.entities.brands = { ...emptyPage };
    },

    fetchAllCategorySuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allCategory = action.payload;
      state.entities.categories = action.payload;
    },
    fetchAllCategoryFailed: (state) => {
      state.allCategory = [] as any;
      state.entities.categories = { ...emptyPage };
    },

    fetchAllSizeSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allSize = action.payload;
      state.entities.sizes = action.payload;
    },
    fetchAllSizeFailed: (state) => {
      state.allSize = [] as any;
      state.entities.sizes = { ...emptyPage };
    },

    fetchAllProductSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allProduct = action.payload;
      state.entities.products = action.payload;
    },
    fetchAllProductFailed: (state) => {
      state.allProduct = [] as any;
      state.entities.products = { ...emptyPage };
    },

    fetchAllInventorySuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allInventory = action.payload;
      state.entities.inventories = action.payload;
    },
    fetchAllInventoryFailed: (state) => {
      state.allInventory = [] as any;
      state.entities.inventories = { ...emptyPage };
    },

    CRUDInventory: (state, action) => {
      state.productData = action.payload;
    },

    UpdateDataPost: (state, action) => {
      state.dataPost = action.payload;
    },

    fetchAllInventoryOfTheCategorySuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allInventoryOfTheCategory = action.payload;
    },
    fetchAllInventoryOfTheCategoryFailed: (state) => {
      state.allInventoryOfTheCategory = [] as any;
    },

    fetchAllVoucherSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allVoucher = action.payload;
      state.entities.vouchers = action.payload;
    },
    fetchAllVoucherFailed: (state) => {
      state.allVoucher = [] as any;
      state.entities.vouchers = { ...emptyPage };
    },

    fetchAllOrderSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allOrder = action.payload;
      state.entities.orders = action.payload;
    },
    fetchAllOrderFailed: (state) => {
      state.allOrder = [] as any;
      state.entities.orders = { ...emptyPage };
    },

    handleChangeSearchProductAdmin: (state, action: PayloadAction<string | null>) => {
      state.ui.searchTextProductAdmin = action.payload;
    },

    fetchAllProductOrderSuccess: (state, action: PayloadAction<PaginatedApiResponse<any>>) => {
      state.allProductOrder = action.payload;
      state.entities.productOrders = action.payload;
    },
    fetchAllProductOrderFailed: (state) => {
      state.allProductOrder = [] as any;
      state.entities.productOrders = { ...emptyPage };
    },

    handleChangeTimeReport: (state, action: PayloadAction<{ timeStart: number; timeEnd: number }>) => {
      state.ui.timeReport = action.payload;
    },
  },
});

// Export legacy action creators for compatibility and provide new aliases
export const {
  fetchAllUserSuccess,
  fetchAllUserFailed,
  fetchAllRoleSuccess,
  fetchAllRoleFailed,
  loadingAdmin,
  fetchAllBrandSuccess,
  fetchAllBrandFailed,
  fetchAllCategorySuccess,
  fetchAllCategoryFailed,
  fetchAllSizeSuccess,
  fetchAllSizeFailed,
  fetchAllProductSuccess,
  fetchAllProductFailed,
  CRUDInventory,
  fetchAllInventorySuccess,
  fetchAllInventoryFailed,
  fetchAllInventoryOfTheCategorySuccess,
  fetchAllInventoryOfTheCategoryFailed,
  UpdateDataPost,
  fetchAllVoucherSuccess,
  fetchAllVoucherFailed,
  fetchAllOrderSuccess,
  fetchAllOrderFailed,
  handleChangeSearchProductAdmin,
  fetchAllProductOrderSuccess,
  fetchAllProductOrderFailed,
  handleChangeTimeReport,
  fetchAllSubscriberSuccess,
  fetchAllSubscriberFailed,
} = adminSlice.actions;

// New, convention-aligned aliases (thunks)
export const fetchAllSubscriber = fetchSubscribers;
export const fetchAllUserRedux = fetchUsers;
export const fetchAllRoleRedux = fetchRoles;
export const fetchAllBrandRedux = fetchBrands;
export const fetchAllCategoryRedux = fetchCategories;
export const fetchAllSizeRedux = fetchSizes;
export const fetchAllProductRedux = fetchProducts;
export const fetchAllVoucherRedux = fetchVouchers;
export const fetchAllOrderAdminRedux = fetchOrders;
export const fetchAllInventoryOfTheCategoryRedux = fetchInventorySizesByCategory;

// New, convention-aligned aliases (actions)
export const setUsers = fetchAllUserSuccess;
export const setBrands = fetchAllBrandSuccess;
export const setCategories = fetchAllCategorySuccess;
export const setSizes = fetchAllSizeSuccess;
export const setProducts = fetchAllProductSuccess;
export const setVouchers = fetchAllVoucherSuccess;
export const setOrders = fetchAllOrderSuccess;
export const setLoading = loadingAdmin;
export const setSearchTextProductAdmin = handleChangeSearchProductAdmin;
export const setTimeReport = handleChangeTimeReport;

export default adminSlice.reducer;
