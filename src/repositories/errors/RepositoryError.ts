import { AxiosError } from 'axios';

export class RepositoryError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly status?: number
    ) {
        super(message);
        this.name = 'RepositoryError';
    }
}

export class NotFoundError extends RepositoryError {
    constructor(message = 'Resource not found') {
        super(message, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends RepositoryError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
    }
}

export class UnauthorizedError extends RepositoryError {
    constructor(message = 'Unauthorized access') {
        super(message, 'UNAUTHORIZED', 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends RepositoryError {
    constructor(message = 'Access forbidden') {
        super(message, 'FORBIDDEN', 403);
        this.name = 'ForbiddenError';
    }
}

export function handleAxiosError(error: unknown): never {
    if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        switch (status) {
            case 400:
                throw new ValidationError(message);
            case 401:
                throw new UnauthorizedError(message);
            case 403:
                throw new ForbiddenError(message);
            case 404:
                throw new NotFoundError(message);
            default:
                throw new RepositoryError(
                    message || 'An unexpected error occurred',
                    'UNKNOWN_ERROR',
                    status
                );
        }
    }

    // For non-Axios errors
    if (error instanceof Error) {
        throw new RepositoryError(error.message, 'UNKNOWN_ERROR');
    }

    throw new RepositoryError('An unexpected error occurred', 'UNKNOWN_ERROR');
}