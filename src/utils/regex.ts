/**
 * @fileoverview A central repository for commonly used regular expressions.
 * This helps ensure consistent validation across the application.
 */

// A reasonably strict regex for email validation.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A regex for usernames: allows letters, numbers, underscores, and hyphens. 3-16 characters.
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,16}$/;

// A regex for phone numbers (example for Vietnamese format).
// Allows optional +84, and then 9 digits starting with 3, 5, 7, 8, or 9.
const PHONE_NUMBER_REGEX = /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/;


export const regex = {
    EMAIL: EMAIL_REGEX,
    USERNAME: USERNAME_REGEX,
    PHONE_NUMBER: PHONE_NUMBER_REGEX,
};
