import { FactoryConfigManager } from '../config/FactoryConfig';
import { IRepositoryFactory } from '../interfaces/IRepositoryFactory';
import { BrandRepository } from '@/repositories/BrandRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { ProductRepository } from '@/repositories/ProductRepository';
import { UserRepository } from '@/repositories/UserRepository';
import { VoucherRepository } from '@/repositories/VoucherRepository';
import { CartRepository } from '@/repositories/CartRepository';
import { OrderRepository } from '@/repositories/OrderRepository';

export class RepositoryFactory implements IRepositoryFactory {
    private static instance: RepositoryFactory;
    private readonly configManager: FactoryConfigManager;

    private constructor() {
        this.configManager = FactoryConfigManager.getInstance();
    }

    public static getInstance(): RepositoryFactory {
        if (!RepositoryFactory.instance) {
            RepositoryFactory.instance = new RepositoryFactory();
        }
        return RepositoryFactory.instance;
    }

    createBrandRepository(): BrandRepository {
        return new BrandRepository(this.configManager.getConfig().apiClient);
    }

    createCategoryRepository(): CategoryRepository {
        return new CategoryRepository(this.configManager.getConfig().apiClient);
    }

    createProductRepository(): ProductRepository {
        return new ProductRepository(this.configManager.getConfig().apiClient);
    }

    createUserRepository(): UserRepository {
        return new UserRepository(this.configManager.getConfig().apiClient);
    }

    createVoucherRepository(): VoucherRepository {
        return new VoucherRepository(this.configManager.getConfig().apiClient);
    }

    createCartRepository(): CartRepository {
        return new CartRepository(this.configManager.getConfig().apiClient);
    }

    createOrderRepository(): OrderRepository {
        return new OrderRepository(this.configManager.getConfig().apiClient);
    }
}
