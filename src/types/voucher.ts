export interface Voucher {
  id: number;
  voucherId: string;
  image: string | null;
  voucherPrice: number;
  quantity: number;
  timeStart: string;
  timeEnd: string;
}
