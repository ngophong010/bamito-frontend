export interface Size {
  id: number;
  sizeId: string;
  name: string;
  categoryId: string;
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