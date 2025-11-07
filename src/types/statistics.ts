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
    readonly id: number;
    readonly quantity: number;
    readonly price: number;
    readonly productName: string;
    readonly productImage: string | null;
    readonly sizeName: string;
    readonly order?: {
        createdAt: string;
    };
}

export interface SalesReportResponse {
    readonly items: SalesReportItem[];
    readonly totalItems: number;
    readonly currentPage: number;
    readonly totalPages: number;
}