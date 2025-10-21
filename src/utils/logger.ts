/**
 * Production-grade logger utility for the e-commerce system
 * Supports different log levels and environments
 */
export const logger = {
    info: (message: string, ...args: any[]) => {
        if (process.env.NODE_ENV !== 'test') {
            console.info(`[INFO] ${message}`, ...args);
        }
    },
    
    error: (message: string, error?: Error, ...args: any[]) => {
        if (process.env.NODE_ENV !== 'test') {
            console.error(`[ERROR] ${message}`, error?.message || '', ...args);
        }
    },
    
    warn: (message: string, ...args: any[]) => {
        if (process.env.NODE_ENV !== 'test') {
            console.warn(`[WARN] ${message}`, ...args);
        }
    },
    
    debug: (message: string, ...args: any[]) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }
};