import apiClient from './apiClient';
import { SizeRepository } from '@/repositories/SizeRepository';
import { Size } from '@/types/size';
import { PaginatedApiResponse } from '@/types/common';
import { CreateSizeDTO, UpdateSizeDTO  } from '@/types/dtos/size.dto';

class SizeService {
  private readonly repository: SizeRepository;

  constructor() {
    this.repository = new SizeRepository(apiClient);
  }

  /**
   * [ADMIN] Fetches a paginated list of all sizes.
   * Maps to: GET /api/v1/sizes
   */
  async getAllSizes(params?: { limit?: number; page?: number; name?: string; }): Promise<PaginatedApiResponse<Size>> {
    return this.repository.getAll(params);
  }

  /** Backward-compatible alias for legacy code */
  async getAllSize(params?: { limit?: number; page?: number; name?: string; }): Promise<PaginatedApiResponse<Size>> {
    return this.getAllSizes(params);
  }

  /**
   * [PUBLIC] Fetches all available sizes for a given category.
   * Maps to: GET /api/v1/categories/:categoryId/sizes
   * @param categoryId - The numeric business key of the category.
   */
  async getSizesForCategory(categoryId: number): Promise<Size[]> {
    return this.repository.getSizesForCategory(categoryId);
  }

  /** Backward-compatible alias returning a paginated-like structure */
  async getAllSizeOfTheCategory(categoryId: number): Promise<PaginatedApiResponse<Size>> {
    const items = await this.getSizesForCategory(categoryId);
    return {
      items,
      totalItems: items.length,
      totalPages: 1,
      currentPage: 1,
    };
  }

  /** Get size by numeric ID */
  async getSizeById(id: number): Promise<Size> {
    return this.repository.getById(id);
  }

  /**
   * [ADMIN] Creates a new size.
   * Maps to: POST /api/v1/sizes
   */
  async createSize(data: CreateSizeDTO): Promise<Size> {
    return this.repository.create(data);
  }

  /**
   * [ADMIN] Updates a size by its business key ID.
   * Maps to: PUT /api/v1/sizes/:id
   */
  async updateSize(id: number, data: UpdateSizeDTO): Promise<Size> {
    return this.repository.update(id, data);
  }

  /**
   * [ADMIN] Deletes a size by its primary key ID.
   * Maps to: DELETE /api/v1/sizes/:id
   */
  async deleteSize(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}

// Export a singleton instance
export const sizeService = new SizeService();
