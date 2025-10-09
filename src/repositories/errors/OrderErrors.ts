export class OrderError extends Error {
    constructor(message: string, public code: string, public statusCode: number) {
        super(message);
        this.name = 'OrderError';
    }
}

export class OrderNotFoundError extends OrderError {
    constructor(orderId: number) {
        super(
            `Order with ID ${orderId} not found`,
            'ORDER_NOT_FOUND',
            404
        );
        this.name = 'OrderNotFoundError';
    }
}

export class OrderValidationError extends OrderError {
    constructor(message: string) {
        super(
            message,
            'ORDER_VALIDATION_ERROR',
            400
        );
        this.name = 'OrderValidationError';
    }
}

export class OrderStatusTransitionError extends OrderError {
    constructor(currentStatus: string, newStatus: string) {
        super(
            `Invalid order status transition from ${currentStatus} to ${newStatus}`,
            'INVALID_STATUS_TRANSITION',
            400
        );
        this.name = 'OrderStatusTransitionError';
    }
}

export class OrderCancellationError extends OrderError {
    constructor(message: string) {
        super(
            message,
            'ORDER_CANCELLATION_ERROR',
            400
        );
        this.name = 'OrderCancellationError';
    }
}