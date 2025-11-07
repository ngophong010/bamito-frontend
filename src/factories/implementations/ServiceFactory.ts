import { IServiceFactory } from '../interfaces/IServiceFactory';
import { brandService } from '@/services/brandService';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import { voucherService } from '@/services/voucherService';
import { cartService } from '@/services/cartService';
import { orderService } from '@/services/orderService';
import { authService } from '@/services/authService';
import { favouriteService } from '@/services/favouriteService';
import { sizeService } from '@/services/sizeService';
import { roleService } from '@/services/roleService';
import { inventoryService } from '@/services/inventoryService';

/**
 * Service Factory that provides access to singleton service instances.
 * Note: Each service is responsible for constructing its own dependencies.
 */
export class ServiceFactory implements IServiceFactory {
    private static instance: ServiceFactory;

    private constructor() {}

    public static getInstance(): ServiceFactory {
        if (!ServiceFactory.instance) {
            ServiceFactory.instance = new ServiceFactory();
        }
        return ServiceFactory.instance;
    }

    createBrandService(): typeof brandService {
        return brandService;
    }

    createCategoryService(): typeof categoryService {
        return categoryService;
    }

    createProductService(): typeof productService {
        return productService;
    }

    createUserService(): typeof userService {
        return userService;
    }

    createVoucherService(): typeof voucherService {
        return voucherService;
    }

    createCartService(): typeof cartService {
        return cartService;
    }

    createOrderService(): typeof orderService {
        return orderService;
    }

    createAuthService(): typeof authService {
        return authService;
    }

    createFavouriteService(): typeof favouriteService {
        return favouriteService;
    }

    createSizeService() {
        return sizeService;
    }

    createInventoryService() {
        return inventoryService;
    }

    createRoleService() {
        return roleService;
    }
}
