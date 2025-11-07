export interface Voucher {
  id: number;
  voucherId: string;
  image: string | null;
  voucherPrice: number;
  quantity: number;
  timeStart: string;
  timeEnd: string;
}

export interface VoucherCreateData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  quantity?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  description?: string;
}

export interface VoucherUpdateData {
  code?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  startDate?: string;
  endDate?: string;
  quantity?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  description?: string;
  isActive?: boolean;
}
