// /src/types/shared.ts

/**
 * Defines the strict, consistent "contract" for ALL responses
 * coming from our backend API.
 */
export interface ServiceResponse {
  /**
   * A machine-readable code indicating the outcome.
   * 0 = Success.
   * Any other positive number = A predictable, non-critical error (e.g., "User not found").
   * Any negative number = A critical or system-level error.
   */
  errCode: number;

  /**
   * A human-readable message describing the outcome.
   * Optional because not every successful response needs a message.
   */
  message?: string;

  /**
   * The actual data payload of the response.
   * The type is 'any' here, but we can cast it to a more specific
   * type in our Redux slices (e.g., `res.data as CartData`).
   */
  data?: any;
}

/**
 * Defines the shape of the complex filter object from the URL query.
 */
export interface FilterOptions {
  brandId?: number[];
  price?: [number, number];
}

// You can add any other types that are shared between your
// frontend and backend communication layer here.

// This interface defines the shape of all paginated API responses.
export interface PaginatedApiResponse<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: T[]; // A generic array of items
}

// Example of a standard JSend-style success response
export interface SuccessApiResponse<T> {
    status: 'success';
    data: T;
}