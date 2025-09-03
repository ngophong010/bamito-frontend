import axios from "../axios";
import type { ServiceResponse, FilterOptions } from "@/types/shared";

// ===============================================================
// --- TYPE DEFINITIONS for function parameters ---
// ===============================================================

interface ProductInput {
  productId: string;
  name: string;
  price: number;
  brandId: number;
  productTypeId: number;
  image?: File;
  discount?: number;
  descriptionContent?: string;
  descriptionHTML?: string;
}

interface PaginationParams {
  limit?: number;
  page?: number;
}

// ===============================================================
// --- CORE PRODUCT CRUD (ADMIN) ---
// ===============================================================

/**
 * @desc    Creates a new product with an image upload.
 * @param   {ProductInput} productData - The product data.
 * @returns {Promise<ServiceResponse>}
 */
/**
 * @desc    Creates a new product with an image upload.
 * @param   {ProductInput} productData - The product data.
 * @returns {Promise<ServiceResponse>}
 */
const handleCreateProductService = async (productData: ProductInput): Promise<ServiceResponse> => {
  // We must use FormData for file uploads
  const formData = new FormData();

  // FIX: Iterate over the keys and handle each value type explicitly.
  Object.keys(productData).forEach(key => {
    const value = productData[key as keyof ProductInput];

    // Check if the value is defined and not null
    if (value !== undefined && value !== null) {
      // If the value is a File object, append it directly.
      // Otherwise, convert it to a string.
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await axios.post(`/api/v1/products`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * @desc    Updates an existing product by its numeric ID.
 * @param   {number} id - The numeric primary key of the product.
 * @param   {Partial<ProductInput>} productData - The product data to update.
 * @returns {Promise<ServiceResponse>}
 */
const handleUpdateProductService = async (id: number, productData: Partial<ProductInput>): Promise<ServiceResponse> => {
  const formData = new FormData();
  Object.keys(productData).forEach(key => {
    const value = productData[key as keyof ProductInput];
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await axios.put(`/api/v1/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * @desc    Deletes a product by its numeric ID.
 * @param   {number} id - The numeric primary key of the product.
 * @returns {Promise<ServiceResponse>}
 */
const handleDeleteProductService = async (id: number): Promise<ServiceResponse> => {
  const response = await axios.delete(`/api/v1/products/${id}`);
  return response.data;
};

// ===============================================================
// --- PUBLIC PRODUCT QUERIES ---
// ===============================================================

/**
 * @desc    Fetches a single product by its human-readable business ID.
 * @param   {string} productId - The business ID (e.g., 'VCL-YNX-100ZZ').
 * @returns {Promise<ServiceResponse>}
 */
const handleGetProductService = async (productId: string): Promise<ServiceResponse> => {
  // It takes a string as input
  const response = await axios.get(`/api/v1/products/${productId}`);
  // It returns the clean data from your backend
  return response.data;
};

/**
 * @desc    Fetches a paginated list of all products.
 * @returns {Promise<ServiceResponse>}
 */
const handleGetAllProductService = async (params: PaginationParams & { name?: string }): Promise<ServiceResponse> => {
  const response = await axios.get(`/api/v1/products`, { params });
  return response.data;
};

/**
 * @desc    Fetches a paginated list of products for a specific category.
 * @returns {Promise<ServiceResponse>}
 */
const handleGetAllProductOfTheProductType = async (params: PaginationParams & { productTypeId: number, sort?: string, filter?: FilterOptions }): Promise<ServiceResponse> => {
  const { productTypeId, ...queryParams } = params;
  const response = await axios.get(`/api/v1/products/types/${productTypeId}`, { params: queryParams });
  return response.data;
};

/**
 * @desc    Fetches a paginated list of products on sale.
 * @returns {Promise<ServiceResponse>}
 */
const handleGetAllProductSaleOffService = async (params: PaginationParams): Promise<ServiceResponse> => {
  const response = await axios.get(`/api/v1/products/sale-off`, { params });
  return response.data;
};

export {
  handleGetAllProductService,
  handleCreateProductService,
  handleUpdateProductService,
  handleDeleteProductService,
  handleGetProductService,
  handleGetAllProductOfTheProductType,
  handleGetAllProductSaleOffService,
};
