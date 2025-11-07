import { ChartTimeRange, OrderStatusStats, OrderStatusUIData, SalesReportItem, ChartData } from '@/types/dashboard';

/**
 * Process sales data into chart format
 */
export function processChartData(
    revenueData: SalesReportItem[], 
    timeRange: ChartTimeRange = ChartTimeRange.YEAR
): ChartData {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    switch (timeRange) {
        case ChartTimeRange.YEAR: {
            const monthlyData = Array(12).fill(0);
            const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

            revenueData?.forEach((item) => {
                const date = new Date(item.time);
                if (date.getFullYear() === currentYear) {
                    const month = date.getMonth();
                    monthlyData[month] += item.totalPrice;
                }
            });

            return {
                data: monthlyData,
                labels
            };
        }

        case ChartTimeRange.MONTH: {
            // Implementation for monthly view
            // Similar to yearly but with days of the month
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const dailyData = Array(daysInMonth).fill(0);
            const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

            revenueData?.forEach((item) => {
                const date = new Date(item.time);
                if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
                    const day = date.getDate() - 1;
                    dailyData[day] += item.totalPrice;
                }
            });

            return {
                data: dailyData,
                labels
            };
        }

        // Add other time range implementations as needed...
        default:
            throw new Error(`Unsupported time range: ${timeRange}`);
    }
}

/**
 * Map order status data to UI representation
 */
export function mapOrderStatusData(statusData: OrderStatusStats[]): OrderStatusUIData[] {
    return statusData.map((status) => {
        let img = "/images/icons/order-default.svg";
        let to = "/admin/orders";

        switch (status.label) {
            case "Xác nhận":
                img = "/images/icons/order-pending.svg";
                to = "/admin/orders?status=1";
                break;
            case "Đang giao":
                img = "/images/icons/order-shipping.svg";
                to = "/admin/orders?status=2";
                break;
            case "Hoàn tất":
                img = "/images/icons/order-completed.svg";
                to = "/admin/orders?status=3";
                break;
            case "Đã hủy":
                img = "/images/icons/order-cancelled.svg";
                to = "/admin/orders?status=0";
                break;
        }

        return { ...status, img, to };
    });
}

/**
 * Format currency values consistently
 */
export const formatCurrency = new Intl.NumberFormat("vi-VN", { 
    style: "currency", 
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});
