import { BaseEntity } from './common';

export interface DashboardStatistics {
    readonly totalIncome: number;
    readonly totalOrder: number;
    readonly totalProduct: number;
    readonly allTotalOrder: Array<OrderStatusStats>;
}

export interface OrderStatusStats {
    readonly label: string;
    readonly quantity: number;
}

export interface OrderStatusUIData extends OrderStatusStats {
    readonly img: string;
    readonly to: string;
}

export interface SalesReportItem extends BaseEntity {
    readonly time: string;
    readonly totalPrice: number;
    readonly quantity: number;
}

export interface SalesReportResponse {
    readonly reportItems: Array<SalesReportItem>;
    readonly totalItems: number;
}

export interface ChartData {
    readonly data: number[];
    readonly labels: string[];
}

// Define supported chart time ranges
export enum ChartTimeRange {
    YEAR = 'year',
    MONTH = 'month',
    WEEK = 'week',
    DAY = 'day'
}

// Define statistic card data structure
export interface StatisticCardData {
    readonly title: string;
    readonly value: string | number;
    readonly icon: string;
    readonly change?: number; // Percentage change from previous period
}
