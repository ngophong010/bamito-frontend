import apiClient from './apiClient';

// ===============================================================
// --- INTERFACES & TYPES ---
// ===============================================================

export interface Voucher {
  id: number;
  voucherId: string;
  image: string | null;
  imageId: string | null;
  voucherPrice: number;
  quantity: number;
  timeStart: string; // ISO Date String
  timeEnd: string;   // ISO Date String
}

interface VouchersApiResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  vouchers: Voucher[];
}

// Data for creating a voucher - note FormData is used for file uploads
export type VoucherCreateData = FormData; 

// Data for updating a voucher - also FormData for optional file uploads
export type VoucherUpdateData = FormData;


// ===============================================================
// --- SERVICE FUNCTIONS ---
// ===============================================================

/**
 * [PUBLIC] Fetches all currently active and valid vouchers for users.
 * Maps to: GET /api/v1/vouchers
 */
export const getActiveVouchers = async (): Promise<Voucher[]> => {
  const response = await apiClient.get('/vouchers');
  return response.data.data;
};

/**
 * [ADMIN] Fetches a paginated list of ALL vouchers.
 * Maps to: GET /api/v1/vouchers/all
 */
export const getAllVouchers = async (params?: { limit?: number; page?: number; name?: string; }): Promise<VouchersApiResponse> => {
  const response = await apiClient.get('/vouchers/all', { params });
  return response.data.data;
};

/**
 * [ADMIN] Creates a new voucher, potentially with an image.
 * Maps to: POST /api/v1/vouchers
 * @param data - FormData object containing voucher data and an optional 'image' file.
 */
export const createVoucher = async (data: VoucherCreateData): Promise<Voucher> => {
  const response = await apiClient.post('/vouchers', data, {
    headers: { 'Content-Type': 'multipart/form-data' }, // Required for file uploads
  });
  return response.data.data;
};

/**
 * [ADMIN] Updates an existing voucher by its primary key ID.
 * Maps to: PUT /api/v1/vouchers/:id
 * @param id - The numeric primary key of the voucher.
 * @param data - FormData object with new data and an optional 'image' file.
 */
export const updateVoucher = async (id: number, data: VoucherUpdateData): Promise<Voucher> => {
  const response = await apiClient.put(`/vouchers/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

/**
 * [ADMIN] Deletes a voucher by its primary key ID.
 * Maps to: DELETE /api/v1/vouchers/:id
 * @param id - The numeric primary key of the voucher to delete.
 */
export const deleteVoucher = async (id: number): Promise<void> => {
  await apiClient.delete(`/vouchers/${id}`);
};
