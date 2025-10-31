import { brandService } from '@/services/brandService';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import { voucherService } from '@/services/voucherService';
import { cartService } from '@/services/cartService';
import { orderService } from '@/services/orderService';
import { sizeService } from '@/services/sizeService';
import { roleService } from '@/services/roleService';
import { authService } from '@/services/authService';
import { favouriteService } from '@/services/favouriteService';
import { inventoryService } from '@/services/inventoryService';

/**
 * Service factory interface defining all available services
 */
export interface IServiceFactory {
    createBrandService(): typeof brandService;
    createCategoryService(): typeof categoryService;
    createProductService(): typeof productService;
    createUserService(): typeof userService;
    createVoucherService(): typeof voucherService;
    createCartService(): typeof cartService;
    createOrderService(): typeof orderService;
    createSizeService(): typeof sizeService;
    createRoleService(): typeof roleService;
    createInventoryService(): typeof inventoryService;
    createAuthService(): typeof authService;
    createFavouriteService(): typeof favouriteService;
}

/**
 * Generic service factory method type
 */
export type ServiceFactoryMethod<T> = () => T;
