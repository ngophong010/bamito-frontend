import dayjs from 'dayjs';
import { SalesReportItem, OrderSummary } from '@/types'; // Assuming you create these types

export const processChartData = (reportItems: SalesReportItem[]): number[] => {
    const monthlyData = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    reportItems?.forEach((item) => {
        const date = new Date(item.order.createdAt);
        if (date.getFullYear() === currentYear) {
            monthlyData[date.getMonth()] += item.price * item.quantity;
        }
    });
    return monthlyData;
};

export const mapOrderStatusData = (statusData: OrderSummary[]) => {
    // ... (same logic as before)
};
