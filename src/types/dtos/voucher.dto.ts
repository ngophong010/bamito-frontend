import { Voucher } from '../voucher';

/**
 * Base pagination parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
}

/**
 * DTO for creating a new voucher
 */
export interface CreateVoucherDTO {
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    startDate: Date;
    endDate: Date;
    maxUsage?: number;
    isActive?: boolean;
    productIds?: number[];
    categoryIds?: number[];
}

/**
 * DTO for updating an existing voucher
 */
export type UpdateVoucherDTO = Partial<CreateVoucherDTO>;

/**
 * Parameters for filtering vouchers
 */
export interface VoucherFilterParams extends PaginationParams {
    code?: string;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    discountType?: 'percentage' | 'fixed';
    sortBy?: 'code' | 'createdAt' | 'startDate' | 'endDate' | 'usageCount';
    sortOrder?: 'asc' | 'desc';
    pagination?: boolean;
}

/**
 * Voucher validation request DTO
 */
export interface ValidateVoucherDTO {
    code: string;
    cartTotal: number;
    productIds?: number[];
    categoryIds?: number[];
}

/**
 * Voucher validation response DTO
 */
export interface VoucherValidationDTO {
    isValid: boolean;
    voucher?: Voucher;
    discountAmount?: number;
    errorMessage?: string;
}

/**
 * Voucher usage statistics DTO
 */
export interface VoucherStatsDTO {
    totalVouchers: number;
    activeVouchers: number;
    expiredVouchers: number;
    totalUsage: number;
    totalDiscountAmount: number;
}

/**
 * Voucher with usage details DTO
 */
export interface VoucherWithUsageDTO extends Voucher {
    usageCount: number;
    remainingUsage: number;
    totalDiscountAmount: number;
}

/**
 * Response DTO for voucher list with statistics
 */
export interface VoucherListResponseDTO {
    vouchers: VoucherWithUsageDTO[];
    stats: VoucherStatsDTO;
}