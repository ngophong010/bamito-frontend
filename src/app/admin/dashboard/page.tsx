import { Metadata } from 'next';

// Import all the service functions needed for the dashboard
import { getStatistics, getSalesReport } from '@/services/orderService';
import DashboardClient from './DashboardClient'; // Import the Client Component

export const metadata: Metadata = {
    title: 'Bảng điều khiển | Trang quản trị',
};

// A server-side helper function to process the raw report data for the chart
const processChartData = (reportData: any) => {
    const monthlyData = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    reportData.items?.forEach((item: any) => {
        const date = new Date(item.order.createdAt);
        if (date.getFullYear() === currentYear) {
            const month = date.getMonth(); // 0-indexed (0 for January)
            monthlyData[month] += item.price * item.quantity;
        }
    });
    return monthlyData;
};

export default async function AdminDashboardPage() {
  // --- DATA FETCHING ON THE SERVER ---
  try {
    // Fetch all required data in parallel for maximum performance
    const [statistics, yearlySalesReport] = await Promise.all([
        getStatistics(),
        getSalesReport({ 
            timeStart: new Date(new Date().getFullYear(), 0, 1).toISOString(),
            timeEnd: new Date(new Date().getFullYear(), 11, 31).toISOString(),
        })
    ]);

    // --- DATA TRANSFORMATION ON THE SERVER ---
    const chartData = processChartData(yearlySalesReport);

    // Pass all the fetched and processed data as props to the Client Component
    return (
      <DashboardClient 
        statistics={statistics}
        chartData={chartData}
      />
    );
  } catch (error) {
    console.error("Failed to load admin dashboard data:", error);
    return <div className="error-message">Could not load dashboard data. Please try again.</div>;
  }
}
