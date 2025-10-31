import { IBaseRepository } from './IBaseRepository';
import { Voucher } from '@/types/voucher';
import { PaginatedApiResponse } from '@/types/common';
import {
    VoucherFilterParams,
    ValidateVoucherDTO,
    VoucherValidationDTO,
    VoucherStatsDTO,
    VoucherListResponseDTO
} from '@/types/dtos/voucher.dto';

export interface IVoucherRepository extends IBaseRepository<Voucher> {
    /**
     * Get all vouchers with filtering and pagination
     */
    getVouchers(params?: VoucherFilterParams): Promise<PaginatedApiResponse<Voucher>>;

    /**
     * Get voucher statistics
     */
    getVoucherStats(): Promise<VoucherStatsDTO>;

    /**
     * Get vouchers with usage details
     */
    getVouchersWithUsage(params?: VoucherFilterParams): Promise<VoucherListResponseDTO>;

    /**
     * Validate a voucher code
     */
    validateVoucher(data: ValidateVoucherDTO): Promise<VoucherValidationDTO>;

    /**
     * Get a voucher by its code
     */
    getVoucherByCode(code: string): Promise<Voucher>;

    /**
     * Toggle voucher active status
     */
    toggleVoucherStatus(voucherId: number, isActive: boolean): Promise<Voucher>;

    /**
     * Get active vouchers for a product
     */
    getActiveVouchersForProduct(productId: number): Promise<Voucher[]>;

    /**
     * Get active vouchers for a category
     */
    getActiveVouchersForCategory(categoryId: number): Promise<Voucher[]>;

    /**
     * Mark voucher as used
     */
    markVoucherUsed(voucherId: number, orderId: number): Promise<void>;
}
