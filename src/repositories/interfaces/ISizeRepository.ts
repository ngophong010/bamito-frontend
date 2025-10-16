import { IBaseRepository } from "./IBaseRepository";
import { Size } from "@/types/size";
import { PaginatedApiResponse } from "@/types/common";
import { SizeFilterParams, CreateSizeDTO, UpdateSizeDTO } from "@/types/dtos/size.dto";

export interface ISizeRepository extends IBaseRepository<Size, CreateSizeDTO, UpdateSizeDTO> {
    /**
     * Get sizes with filtering and pagination
     * @param params Filtering and pagination parameters
     * @return Paginated list of sizes
    */
    getSizes(params?: SizeFilterParams): Promise<PaginatedApiResponse<Size>>;

    /**
     * Get sizes for a specific category
     */
    getSizesForCategory(categoryId: number): Promise<Size[]>;

    /**
     * Get a single size by numeric ID
     */
    getById(id: number): Promise<Size>;

    /**
     * Toggle size active status
     */
    toggleStatus(id: number, isActive: boolean): Promise<Size>;
}
