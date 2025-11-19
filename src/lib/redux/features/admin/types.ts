import type { PaginatedApiResponse } from '@/types';
import type { OrderSummary } from '@/types/order';

/**
 * Shared types for admin slices
 */

export interface Subscriber {
  email_address: string;
  bamito_status: 'Khách hàng' | 'Ẩn danh';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  filter?: string;
}

export interface TimeRangeParams extends PaginationParams {
  timeStart: number;
  timeEnd: number;
}

export const emptyPage = { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };

/**
 * UI State for admin features
 */
export interface AdminUIState {
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  searchTextProductAdmin: string | null;
  timeReport: {
    timeStart: number;
    timeEnd: number;
  };
}

/**
 * Entities container - normalized state structure
 */
export interface AdminEntities {
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
  orders: PaginatedApiResponse<OrderSummary>;
  productOrders: PaginatedApiResponse<any>;
}
