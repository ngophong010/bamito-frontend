import { AxiosInstance } from 'axios';

/**
 * Configuration interface for the factory system
 */
export interface IFactoryConfig {
    apiClient: AxiosInstance;
    apiBaseUrl: string;
    defaultPageSize: number;
    maxPageSize: number;
    enableCache: boolean;
    cacheTimeout: number;
}

/**
 * Default factory configuration
 */
export const defaultConfig: IFactoryConfig = {
    apiClient: null!, // Must be set during initialization
    apiBaseUrl: '/api/v1',
    defaultPageSize: 10,
    maxPageSize: 100,
    enableCache: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
};

/**
 * Factory configuration manager
 */
export class FactoryConfigManager {
    private static instance: FactoryConfigManager;
    private config: IFactoryConfig;

    private constructor() {
        this.config = { ...defaultConfig };
    }

    public static getInstance(): FactoryConfigManager {
        if (!FactoryConfigManager.instance) {
            FactoryConfigManager.instance = new FactoryConfigManager();
        }
        return FactoryConfigManager.instance;
    }

    public getConfig(): IFactoryConfig {
        return this.config;
    }

    public updateConfig(partialConfig: Partial<IFactoryConfig>): void {
        this.config = {
            ...this.config,
            ...partialConfig,
        };
    }

    public setApiClient(apiClient: AxiosInstance): void {
        this.config.apiClient = apiClient;
    }
}