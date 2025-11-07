import { createEntitySlice } from '../../factories/createEntitySlice';
import { brandService } from '@/services/brandService';
import { Brand } from '@/types/brand';

interface BrandParams {
  limit?: number;
  page?: number;
  name?: string;
  pagination?: boolean;
}

const { slice, fetchThunk, actions, reducer } = createEntitySlice<Brand>(
  'brands',
  async (params: BrandParams) => {
    return await brandService.getBrands(params);
  }
);

export const fetchBrands = fetchThunk;
export const { clearItems: clearBrands } = actions;
export default reducer;

// Selectors
export const selectBrands = (state: { brands: ReturnType<typeof reducer> }) => state.brands.items;
export const selectBrandsStatus = (state: { brands: ReturnType<typeof reducer> }) => state.brands.status;
export const selectBrandsPagination = (state: { brands: ReturnType<typeof reducer> }) => ({
  totalItems: state.brands.totalItems,
  totalPages: state.brands.totalPages,
  currentPage: state.brands.currentPage,
});
