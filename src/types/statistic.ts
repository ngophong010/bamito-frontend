export interface OrderStatusSummary {
    label: string;
    quantity: number;
}

export interface StatisticsResponse {
    totalIncome: number;
    totalOrder: number;
    totalProduct: number;
    allTotalOrder: OrderStatusSummary[];
}
