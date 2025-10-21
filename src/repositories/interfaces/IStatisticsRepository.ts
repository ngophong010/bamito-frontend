import { SalesReportParams, SalesReportResponse, StatisticsResponse } from '@/types/statistics';

export interface IStatisticsRepository {
    /**
     * Get overall statistics including total income, orders, products, and order status summary
     */
    getStatistics(): Promise<StatisticsResponse>;

    /**
     * Get detailed sales report with filtering and pagination
     */
    getSalesReport(params: SalesReportParams): Promise<SalesReportResponse>;
}