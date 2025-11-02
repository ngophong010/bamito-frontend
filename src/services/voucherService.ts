import apiClient from './apiClient';
import { VoucherRepository } from '@/repositories/VoucherRepository';
import { Voucher } from '@/types/voucher';
import { PaginatedApiResponse } from '@/types/common';
import {
    CreateVoucherDTO,
    UpdateVoucherDTO,
    VoucherFilterParams,
    ValidateVoucherDTO,
    VoucherValidationDTO,
    VoucherStatsDTO,
    VoucherListResponseDTO
} from '@/types/dtos/voucher.dto';

class VoucherService {
    private readonly repository: VoucherRepository;

    constructor() {
        this.repository = new VoucherRepository(apiClient);
    }

    /**
     * Get active vouchers
     */
    async getActiveVouchers(): Promise<Voucher[]> {
        const result = await this.repository.getVouchers({ isActive: true });
        return result.items;
    }

    /**
     * Get all vouchers with filtering and pagination
     */
    async getAllVouchers(params?: VoucherFilterParams): Promise<PaginatedApiResponse<Voucher>> {
        return this.repository.getVouchers(params);
    }

    /**
     * Get a voucher by ID
     */
    async getVoucherById(id: number): Promise<Voucher> {
        return this.repository.getById(id);
    }

    /**
     * Get a voucher by code
     */
    async getVoucherByCode(code: string): Promise<Voucher> {
        return this.repository.getVoucherByCode(code);
    }

    /**
     * Create a new voucher
     */
    async createVoucher(data: CreateVoucherDTO | FormData): Promise<Voucher> {
        // Handle FormData if image is included
        if (data instanceof FormData) {
            const response = await apiClient.post('/vouchers', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data;
        }
        return this.repository.create(data);
    }

    /**
     * Update a voucher
     */
    async updateVoucher(id: number, data: UpdateVoucherDTO | FormData): Promise<Voucher> {
        // Handle FormData if image is included
        if (data instanceof FormData) {
            const response = await apiClient.put(`/vouchers/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data;
        }
        return this.repository.update(id, data);
    }

    /**
     * Delete a voucher
     */
    async deleteVoucher(id: number): Promise<void> {
        return this.repository.delete(id);
    }

    /**
     * Get voucher statistics
     */
    async getVoucherStats(): Promise<VoucherStatsDTO> {
        return this.repository.getVoucherStats();
    }

    /**
     * Get vouchers with usage details
     */
    async getVouchersWithUsage(params?: VoucherFilterParams): Promise<VoucherListResponseDTO> {
        return this.repository.getVouchersWithUsage(params);
    }

    /**
     * Validate a voucher code
     */
    async validateVoucher(data: ValidateVoucherDTO): Promise<VoucherValidationDTO> {
        return this.repository.validateVoucher(data);
    }

    /**
     * Toggle voucher active status
     */
    async toggleVoucherStatus(voucherId: number, isActive: boolean): Promise<Voucher> {
        return this.repository.toggleVoucherStatus(voucherId, isActive);
    }

    /**
     * Get active vouchers for a product
     */
    async getActiveVouchersForProduct(productId: number): Promise<Voucher[]> {
        return this.repository.getActiveVouchersForProduct(productId);
    }

    /**
     * Get active vouchers for a category
     */
    async getActiveVouchersForCategory(categoryId: number): Promise<Voucher[]> {
        return this.repository.getActiveVouchersForCategory(categoryId);
    }

    /**
     * Mark voucher as used
     */
    async markVoucherUsed(voucherId: number, orderId: number): Promise<void> {
        return this.repository.markVoucherUsed(voucherId, orderId);
    }
}

// Export a singleton instance
export const voucherService = new VoucherService();
