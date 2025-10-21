/**
 * Represents an error returned from the API.
 */
export class ApiError extends Error {
  /**
   * Create a new API error.
   * @param message Human-readable message describing the error
   * @param code Machine-readable error code for programmatic handling
   * @param status HTTP status code if applicable
   */
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Error codes
   */
  static readonly CODES = {
    PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    INVALID_REQUEST: 'INVALID_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
  } as const;
}