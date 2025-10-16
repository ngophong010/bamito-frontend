import { AxiosInstance } from 'axios';
import { BaseRepository } from './BaseRepository';
import { IVoucherRepository } from './interfaces/IVoucherRepository';
import { Voucher } from '@/types/voucher';
import { PaginatedApiResponse } from '@/types/common';
import {
    VoucherFilterParams,
    ValidateVoucherDTO,
    VoucherValidationDTO,
    VoucherStatsDTO,
    VoucherListResponseDTO,
    CreateVoucherDTO,
    UpdateVoucherDTO
} from '@/types/dtos/voucher.dto';

export class VoucherRepository extends BaseRepository<Voucher> implements IVoucherRepository {
    constructor(apiClient: AxiosInstance) {
        super(apiClient, '/vouchers');
    }

    /**
     * Get all vouchers with filtering and pagination
     */
    async getVouchers(params?: VoucherFilterParams): Promise<PaginatedApiResponse<Voucher>> {
        const response = await this.apiClient.get<PaginatedApiResponse<Voucher>>(this.basePath, { params });
        return response.data;
    }

    /**
     * Get voucher statistics
     */
    async getVoucherStats(): Promise<VoucherStatsDTO> {
        const response = await this.apiClient.get<VoucherStatsDTO>(`${this.basePath}/stats`);
        return response.data;
    }

    /**
     * Get vouchers with usage details
     */
    async getVouchersWithUsage(params?: VoucherFilterParams): Promise<VoucherListResponseDTO> {
        const response = await this.apiClient.get<VoucherListResponseDTO>(`${this.basePath}/with-usage`, {
            params
        });
        return response.data;
    }

    /**
     * Validate a voucher code
     */
    async validateVoucher(data: ValidateVoucherDTO): Promise<VoucherValidationDTO> {
        const response = await this.apiClient.post<VoucherValidationDTO>(
            `${this.basePath}/validate`,
            data
        );
        return response.data;
    }

    /**
     * Get a voucher by its code
     */
    async getVoucherByCode(code: string): Promise<Voucher> {
        const response = await this.apiClient.get<Voucher>(`${this.basePath}/code/${code}`);
        return response.data;
    }

    /**
     * Toggle voucher active status
     */
    async toggleVoucherStatus(voucherId: number, isActive: boolean): Promise<Voucher> {
        const response = await this.apiClient.patch<Voucher>(
            `${this.basePath}/${voucherId}/toggle-status`,
            { isActive }
        );
        return response.data;
    }

    /**
     * Get active vouchers for a product
     */
    async getActiveVouchersForProduct(productId: number): Promise<Voucher[]> {
        const response = await this.apiClient.get<Voucher[]>(
            `${this.basePath}/product/${productId}`
        );
        return response.data;
    }

    /**
     * Get active vouchers for a category
     */
    async getActiveVouchersForCategory(categoryId: number): Promise<Voucher[]> {
        const response = await this.apiClient.get<Voucher[]>(
            `${this.basePath}/category/${categoryId}`
        );
        return response.data;
    }

    /**
     * Mark voucher as used
     */
    async markVoucherUsed(voucherId: number, orderId: number): Promise<void> {
        await this.apiClient.post(`${this.basePath}/${voucherId}/use`, { orderId });
    }

    // Implement inherited methods from BaseRepository
    async create(data: CreateVoucherDTO): Promise<Voucher> {
        return super.create(data);
    }

    async update(id: number, data: UpdateVoucherDTO): Promise<Voucher> {
        return super.update(id, data);
    }

    async delete(id: number): Promise<void> {
        return super.delete(id);
    }

    async getById(id: number): Promise<Voucher> {
        return super.getById(id);
    }
}