import { BaseDTO, BaseFilterParams, BulkOperationDTO } from './dtos/_base.dto';

export interface Size extends BaseDTO {
  id: number;
  sizeId: string;  
  name: string;
    description?: string;
    categoryId: number;
    order: number;
    isActive: boolean;
    productCount?: number;
    measurements?: {
        width?: number;
        height?: number;
        length?: number;
        unit: 'cm' | 'inch';
    };
}

export interface CreateSizeDTO {
  sizeId: string;
  name: string;
  categoryId: string;
}

export interface UpdateSizeDTO {
  sizeId?: string;
  name?: string;
  categoryId?: string;
}

export interface SizeFilterParams {
  page?: number;
  limit?: number;
  name?: string;
}