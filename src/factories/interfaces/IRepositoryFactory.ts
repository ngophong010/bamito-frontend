import { IBaseRepository } from '../../repositories/interfaces/IBaseRepository';
import { IBrandRepository } from '../../repositories/interfaces/IBrandRepository';
import { ICategoryRepository } from '../../repositories/interfaces/ICategoryRepository';
import { IProductRepository } from '../../repositories/interfaces/IProductRepository';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IVoucherRepository } from '../../repositories/interfaces/IVoucherRepository';
import { ICartRepository } from '../../repositories/interfaces/ICartRepository';
import { IOrderRepository } from '../../repositories/interfaces/IOrderRepository';

/**
 * Repository factory interface defining all available repositories
 */
export interface IRepositoryFactory {
    createBrandRepository(): IBrandRepository;
    createCategoryRepository(): ICategoryRepository;
    createProductRepository(): IProductRepository;
    createUserRepository(): IUserRepository;
    createVoucherRepository(): IVoucherRepository;
    createCartRepository(): ICartRepository;
    createOrderRepository(): IOrderRepository;
}

/**
 * Generic repository factory method type
 */
export type RepositoryFactoryMethod<T extends IBaseRepository<any>> = () => T;