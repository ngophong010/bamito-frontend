import { RegisterOptions } from 'react-hook-form';

export const PRODUCT_VALIDATION_RULES: Record<string, RegisterOptions> = {
    productId: {
        required: 'Product ID is required',
        pattern: {
            value: /^[A-Z0-9-]+$/,
            message: 'Product ID must contain only uppercase letters, numbers, and hyphens'
        },
        minLength: {
            value: 3,
            message: 'Product ID must be at least 3 characters'
        },
        maxLength: {
            value: 50,
            message: 'Product ID must not exceed 50 characters'
        }
    },
    name: {
        required: 'Product name is required',
        minLength: {
            value: 3,
            message: 'Name must be at least 3 characters'
        },
        maxLength: {
            value: 100,
            message: 'Name must not exceed 100 characters'
        }
    },
    price: {
        required: 'Price is required',
        min: {
            value: 0,
            message: 'Price must be greater than or equal to 0'
        },
        validate: (value) => value >= 0 || 'Price cannot be negative'
    },
    discount: {
        required: 'Discount is required',
        min: {
            value: 0,
            message: 'Discount must be between 0 and 100'
        },
        max: {
            value: 100,
            message: 'Discount must be between 0 and 100'
        },
        validate: (value) => 
            (value >= 0 && value <= 100) || 'Discount must be between 0 and 100'
    },
    brandId: {
        required: 'Brand is required'
    },
    categoryId: {
        required: 'Category is required'
    },
    descriptionHTML: {
        required: 'Description is required',
        validate: {
            notEmpty: (value) => 
                value.trim() !== '' || 'Description cannot be empty'
        }
    }
};