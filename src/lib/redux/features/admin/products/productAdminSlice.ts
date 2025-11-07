import { createEntitySlice } from '../../../factories/createEntitySlice';
import { serviceFactory } from '@/factories';
import { PAGINATION_LIMIT } from '@/lib/utils/constants';
import { ProductListItem } from '@/types/product';

const productService = serviceFactory.createProductService();

const { slice, fetchThunk, actions, reducer } = createEntitySlice<ProductListItem>(
  'adminProducts',
  async (params: { page?: number; limit?: number; name?: string }) => {
    const page = params.page || 1;
    const limit = params.limit || PAGINATION_LIMIT.PRODUCTS;
    
    const response = await productService.getAllProducts({ page, limit, name: params.name });
    
    return {
      items: response.items,
      totalItems: response.totalItems,
      totalPages: Math.ceil(response.totalItems / limit),
      currentPage: page
    };
  }
);

export const fetchProducts = fetchThunk;
export const { clearItems: clearProducts } = actions;
export default reducer;