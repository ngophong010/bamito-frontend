/**
 * Interface representing the data structure for creating or updating a product
 * @interface ProductCreateData
 * @property {string} productId - Unique identifier for the product (uppercase letters, numbers, hyphens)
 * @property {string} name - Product name (3-100 characters)
 * @property {number} price - Product price (non-negative)
 * @property {number} discount - Discount percentage (0-100)
 * @property {number} brandId - ID of the associated brand
 * @property {number} categoryId - ID of the associated category
 * @property {string} descriptionHTML - HTML description of the product
 * @property {File} [image] - Optional product image file
 */
export interface ProductCreateData {
    productId: string;
    name: string;
    price: number;
    discount: number;
    brandId: number;
    categoryId: number;
    descriptionHTML: string;
    image?: File;
}

/**
 * Constants for product validation
 */
const VALIDATION_CONSTANTS = {
    PRODUCT_ID: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 50,
        PATTERN: /^[A-Z0-9-]+$/
    },
    NAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 100
    },
    PRICE: {
        MIN: 0
    },
    DISCOUNT: {
        MIN: 0,
        MAX: 100
    }
} as const;

/**
 * Validation rules for product form fields
 * @constant PRODUCT_VALIDATION_RULES
 */
export const PRODUCT_VALIDATION_RULES = {
    productId: {
        required: "Product ID is required",
        pattern: {
            value: VALIDATION_CONSTANTS.PRODUCT_ID.PATTERN,
            message: "Product ID must contain only uppercase letters, numbers, and hyphens"
        },
        minLength: {
            value: VALIDATION_CONSTANTS.PRODUCT_ID.MIN_LENGTH,
            message: `Product ID must be at least ${VALIDATION_CONSTANTS.PRODUCT_ID.MIN_LENGTH} characters long`
        },
        maxLength: {
            value: VALIDATION_CONSTANTS.PRODUCT_ID.MAX_LENGTH,
            message: `Product ID must not exceed ${VALIDATION_CONSTANTS.PRODUCT_ID.MAX_LENGTH} characters`
        }
    },
    name: {
        required: "Product name is required",
        minLength: {
            value: 3,
            message: "Product name must be at least 3 characters long"
        },
        maxLength: {
            value: 100,
            message: "Product name must not exceed 100 characters"
        }
    },
    price: {
        required: "Price is required",
        min: {
            value: 0,
            message: "Price must be greater than or equal to 0"
        },
        validate: (value: number) => value >= 0 || "Price cannot be negative"
    },
    discount: {
        required: "Discount percentage is required",
        min: {
            value: 0,
            message: "Discount must be between 0 and 100"
        },
        max: {
            value: 100,
            message: "Discount must be between 0 and 100"
        },
        validate: (value: number) => 
            (value >= 0 && value <= 100) || "Discount must be between 0 and 100"
    },
    brandId: {
        required: "Brand is required"
    },
    categoryId: {
        required: "Category is required"
    },
    descriptionHTML: {
        required: "Description is required",
        validate: {
            notEmpty: (value: string) => 
                value.trim() !== "" || "Description cannot be empty"
        }
    }
} as const;
