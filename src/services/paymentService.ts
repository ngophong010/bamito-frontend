import apiClient from './apiClient';
import { OrderCreateData } from './profileOrderService'; // We can reuse the type

interface VnPayUrlResponse {
    paymentUrl: string;
}

/**
 * Creates a VNPAY payment URL for checkout.
 * Maps to: POST /api/v1/payment/create-url
 * @param data - The full order data needed to generate the URL.
 */
export const createVnPayUrl = async (data: OrderCreateData): Promise<VnPayUrlResponse> => {
    const response = await apiClient.post('/payment/create-url', data);
    return response.data.data;
};
