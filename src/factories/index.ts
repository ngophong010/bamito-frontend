import apiClient from '@/services/apiClient';
import { FactoryConfigManager } from './config/FactoryConfig';
import { RepositoryFactory } from './implementations/RepositoryFactory';
import { ServiceFactory } from './implementations/ServiceFactory';

/**
 * Initialize the factory system with configuration
 */
export function initializeFactorySystem() {
    // Initialize configuration
    const configManager = FactoryConfigManager.getInstance();
    configManager.setApiClient(apiClient);
    configManager.updateConfig({
        apiBaseUrl: '/api/v1',
        defaultPageSize: 10,
        maxPageSize: 100,
        enableCache: true,
        cacheTimeout: 5 * 60 * 1000 // 5 minutes
    });

    // Initialize factories
    RepositoryFactory.getInstance();
    ServiceFactory.getInstance();
}

// Export factory instances
export const repositoryFactory = RepositoryFactory.getInstance();
export const serviceFactory = ServiceFactory.getInstance();

// Example usage:
/*
// Initialize the system
initializeFactorySystem();

// Use factories to create services
const productService = serviceFactory.createProductService();
const categoryService = serviceFactory.createCategoryService();

// Services will have their dependencies automatically injected
const products = await productService.getProducts();
const categories = await categoryService.getCategories();
*/
