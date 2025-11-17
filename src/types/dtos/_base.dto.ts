/**
 * Centralized, production-grade DTO contracts used across the frontend.
 * These types cover shared shapes (pagination, sorting, date ranges),
 * cross-cutting concerns (SEO, media, audit, soft-delete), and new domain
 * areas (auth, feedback, inventory, payment, favourites, roles, reporting,
 * shipping, import/export).
 *
 * Intent:
 * - Provide a single source of truth for common DTOs
 * - Reduce duplication across feature DTO files
 * - Enable consistency for service/repository contracts
 */

export interface BaseDTO {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseFilterParams {
    page?: number;
    limit?: number;
    sort?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

export interface BaseStatsDTO {
    total: number;
    active: number;
    inactive: number;
}

// Sorting
export type SortOrder = 'asc' | 'desc';

export interface SortParams<TField extends string = string> {
  sortBy?: TField;
  sortOrder?: SortOrder;
}

// Pagination
export interface PaginationParams {
  page?: number; // 1-based
  limit?: number; // per-page size
  pagination?: boolean; // allow disabling pagination explicitly
}

// Date range (ISO 8601 strings)
export interface DateRange {
  from?: string; // inclusive
  to?: string;   // inclusive
}

// Identifiers
export interface IdDTO<T = number> { id: T }
export interface IdsDTO<T = number> { ids: T[] }
export interface SlugDTO { slug: string }

// Bulk operations
export type DefaultBulkOperation = 'activate' | 'deactivate' | 'archive' | 'restore' | 'delete';
export interface BulkOperationDTO<TId = number, TOp extends string = DefaultBulkOperation> {
  ids: TId[];
  operation: TOp;
  reason?: string;
  note?: string;
}

// Media / Uploads
export interface MediaAssetDTO {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  sizeBytes?: number;
}

export interface UploadRequestDTO {
  fileName: string;
  contentType: string;
  sizeBytes: number;
  folder?: string;
  metadata?: Record<string, string>;
}

export interface UploadResponseDTO {
  url: string;
  publicId?: string; // e.g., cloudinary key
}

// SEO
export interface SeoDTO {
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

// Audit / Soft delete
export interface AuditDTO {
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string; // ISO time
  updatedAt?: string; // ISO time
}

export interface SoftDeleteDTO {
  isDeleted?: boolean;
  deletedAt?: string | null;
}

// Addressing / Delivery
export interface AddressDTO {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  ward?: string;
  district?: string;
  city: string;
  country: string;
  postalCode?: string;
  isDefault?: boolean;
}

export type CreateDeliveryAddressDTO = AddressDTO;
export type UpdateDeliveryAddressDTO = Partial<AddressDTO>;

// Authentication / Authorization
export interface LoginDTO {
  identifier: string; // it can be email Or Username
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDTO {
  userName: string;
  email: string;
  password: string;
  roleId?: number;
  phoneNumber?: string;
  birthday?: string; // ISO date
  avatar?: string;
}

export interface RefreshTokenDTO { refreshToken: string }

export interface AuthTokensDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  tokenType?: 'Bearer';
}

export interface VerifyEmailDTO { token: string }
export interface ForgotPasswordDTO { email: string }
export interface ResetPasswordDTO { 
  token: string; 
  otpCode?: string;
  newPassword: string 
}
export interface ChangeEmailDTO { password: string; newEmail: string }

export interface BeginTwoFactorDTO { method: 'totp' | 'sms' | 'email' }
export interface VerifyTwoFactorDTO { code: string }

export interface UpdateProfileDTO {
  userName?: string;
  email?: string;
  phoneNumber?: string;
  birthday?: string; // ISO date
  avatar?: string;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ResendOtpDTO {
  identifier: string; // could be email, phone, or usernaem
  purpose: 'verify_email' | '2fa' | 'reset_password';
  method?: 'email' | 'sms';
}

// Favourites / Wishlist
export interface ToggleFavouriteDTO { productId: number }
export interface FavouriteFilterParams extends PaginationParams {
  userId?: number;
}

// Feedback / Reviews
export interface CreateFeedbackDTO {
  productId: number;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  content?: string;
  images?: MediaAssetDTO[];
  orderId?: number; // verify user purchased
}

export type UpdateFeedbackDTO = Partial<CreateFeedbackDTO>;

export interface FeedbackFilterParams extends PaginationParams, SortParams<'createdAt' | 'rating'> {
  productId?: number;
  userId?: number;
  rating?: number;
  hasImages?: boolean;
  search?: string;
}

export interface FeedbackStatsDTO {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  withImages: number;
  withText: number;
}

// Inventory / Stock
export interface InventoryItemDTO {
  productId: number;
  sizeId?: number;
  sku?: string;
  inStock: number;
  reserved: number;
  available: number; // derived: inStock - reserved
  lowStockThreshold?: number;
}

export interface StockAdjustmentDTO {
  productId: number;
  sizeId?: number;
  quantityDelta: number;
  reason: 'manual' | 'order' | 'return' | 'restock' | 'correction';
  note?: string;
}

export interface InventoryFilterParams extends PaginationParams, SortParams<'inStock' | 'available' | 'createdAt'> {
  productId?: number;
  sizeId?: number;
  sku?: string;
  lowStockOnly?: boolean;
  inStockGTE?: number;
  inStockLTE?: number;
}

// Payments
export type PaymentProvider = 'cod' | 'paypal' | 'stripe' | 'vnpay' | 'momo';

export interface CreatePaymentIntentDTO {
  amount: number; // in minor units where applicable
  currency: string; // e.g., 'VND', 'USD'
  paymentMethod: PaymentProvider;
  orderId?: number;
  returnUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResultDTO {
  success: boolean;
  provider: PaymentProvider;
  providerReference?: string; // e.g., session id
  transactionId?: string;
  errorMessage?: string;
}

export interface PaymentWebhookDTO {
  provider: Exclude<PaymentProvider, 'cod'>;
  event: string;
  payload: any; // provider-specific structure
}

// Feeds / Catalog browsing
export interface FeedFilterParams extends PaginationParams, SortParams<'popularity' | 'newest' | 'price' | 'discount'> {
  categoryId?: number;
  brandId?: number;
  price?: [number, number];
  search?: string;
}

// Roles / Permissions
export interface CreateRoleDTO {
  name: string;
  description?: string;
  permissions: string[]; // granular permission keys
}

export type UpdateRoleDTO = Partial<CreateRoleDTO>;

export interface AssignRoleDTO {
  userId: number;
  roleId: number;
}

// Reporting
export interface SalesReportFilterDTO {
  range?: DateRange;
  groupBy?: 'day' | 'week' | 'month';
  brandId?: number;
  categoryId?: number;
  productId?: number;
}

export interface SalesReportDTO {
  revenue: number;
  orders: number;
  avgOrderValue: number;
  byPeriod: Array<{ period: string; revenue: number; orders: number }>;
}

// Import / Export
export interface ImportDTO<T> {
  items: T[];
  dryRun?: boolean;
}

export interface ImportResultDTO {
  successCount: number;
  failureCount: number;
  errors: Array<{ index: number; message: string; code?: string }>;
}

export interface ExportDTO {
  format: 'csv' | 'xlsx' | 'json';
  filters?: Record<string, any>;
}

// Reordering (drag/drop) within a scope (e.g., category)
export interface ReorderDTO<TId = number> {
  items: Array<{ id: TId; order: number }>;
  scope?: { categoryId?: number; parentId?: number };
}

// Search
export interface SearchParams extends PaginationParams {
  q: string;
}

// Shipping / Rates
export interface ShippingRateRequestDTO {
  address: AddressDTO;
  items: Array<{ productId: number; sizeId?: number; quantity: number }>;
}

export interface ShippingRateDTO {
  provider: string;
  service: string;
  fee: number;
  estimatedDays: number;
}

// Notifications (optional cross-cutting)
export interface SendNotificationDTO {
  userId?: number; // direct user
  topic?: string;  // broadcast topic
  title: string;
  body: string;
  data?: Record<string, string>;
}
