export interface Brand {
  id: number;
  brandId: string;
  name: string;
}

export interface BrandCreateData {
  brandId: string;
  name: string;
}

export type BrandUpdateData = Partial<BrandCreateData>;
