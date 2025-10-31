import { createEntitySlice } from '../../../factories/createEntitySlice';
import { serviceFactory } from '@/factories';
import { PAGINATION_LIMIT } from '@/lib/utils/constants';
import { OrderSummary } from '@/types/order';

const orderService = serviceFactory.createOrderService();

const { slice, fetchThunk, actions, reducer } = createEntitySlice<OrderSummary>(
  'adminOrders',
  async (params: { page?: number; limit?: number }) => {
    const page = params.page || 1;
    const limit = params.limit || PAGINATION_LIMIT.ORDERS;
    
    const response = await orderService.getOrderSummaries({ page, limit });
    
    return {
      items: response.items,
      totalItems: response.totalItems,
      totalPages: Math.ceil(response.totalItems / limit),
      currentPage: page
    };
  }
);

export const fetchOrders = fetchThunk;
export const { clearItems: clearOrders } = actions;
export default reducer;