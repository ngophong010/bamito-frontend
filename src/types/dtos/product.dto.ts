// DTOs (Data Transfer Objects) for Product operations
export interface CreateProductDTO {
    name: string;
    price: number;
    discount: number;
    image: string | null;
    descriptionHTML: string | null;
    brandId: number;
    categoryId: number;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
