import { createEntitySlice } from '../../../factories/createEntitySlice';
import { serviceFactory } from '@/factories';
import { PAGINATION_LIMIT } from '@/lib/utils/constants';
import { User } from '@/types/user';

const userService = serviceFactory.createUserService();

const { slice, fetchThunk, actions, reducer } = createEntitySlice<User>(
  'adminUsers',
  async (params: { page?: number; limit?: number }) => {
    const page = params.page || 1;
    const limit = params.limit || PAGINATION_LIMIT.USER;
    
    const response = await userService.getUsers({ page, limit });
    
    return {
      items: response.items,
      totalItems: response.totalItems,
      totalPages: Math.ceil(response.totalItems / limit),
      currentPage: page
    };
  }
);

export const fetchUsers = fetchThunk;
export const { clearItems: clearUsers } = actions;
export default reducer;
