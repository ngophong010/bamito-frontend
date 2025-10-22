import { ROLES } from "@/config/role";

/**
 * Application-wide constants.
 */
export const PAGINATION_LIMIT = {
    ADMIN: 15,
    PRODUCTS: 12,
    SEARCH: 12,
    ORDERS: 5,
    SUBSCRIBER: 10,
    USER: 12,
    ROLES: 10,
    BRANDS: 12,
    CATEGORIES: 12,
    SIZES: 20,
    VOUCHERS: 10,
    FEED: 10,
};

// Legacy export for backward compatibility
export const LIMIT = PAGINATION_LIMIT.ADMIN;
