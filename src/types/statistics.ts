export interface OrderStatusSummary {
    readonly label: string;
    readonly quantity: number;
}

export interface StatisticsResponse {
    readonly totalIncome: number;
    readonly totalOrder: number;
    readonly totalProduct: number;
    readonly allTotalOrder: OrderStatusSummary[];
}

export interface SalesReportParams {
    readonly fromDate?: string;
    readonly toDate?: string;
    readonly limit?: number;
    readonly page?: number;
}

export interface SalesReportItem {
    readonly time: string;
    readonly totalPrice: number;
    readonly quantity: number;
    readonly productId: number;
    readonly productName: string;
}

export interface SalesReportResponse {
    readonly reportItems: SalesReportItem[];
    readonly totalItems: number;
    readonly page: number;
    readonly totalPages: number;
}