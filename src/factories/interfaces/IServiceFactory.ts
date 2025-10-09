import { brandService } from '@/services/brandService';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import { voucherService } from '@/services/voucherService';
import { cartService } from '@/services/cartService';
import { orderService } from '@/services/orderService';

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
}

/**
 * Generic service factory method type
 */
export type ServiceFactoryMethod<T> = () => T;