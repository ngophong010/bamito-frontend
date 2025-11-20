import { Metadata } from 'next';
import dayjs from 'dayjs';

// 1. Import the correct, refactored service function
import { orderService } from '@/services/orderService';
import ReportClient from './ReportClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Báo cáo Doanh thu',
};

export const dynamic = 'force-dynamic';

// 2. Define the shape of the props Next.js will provide
interface RevenueReportPageProps {
  searchParams: Promise<{
    page?: string;
    fromDate?: string; // ISO Date string
    toDate?: string;   // ISO Date string
  }>;
}

export default async function RevenueReportPage({ searchParams }: RevenueReportPageProps) {
  // --- 3. DATA FETCHING ON THE SERVER ---
  try {
    // Provide sensible defaults for the date range if they aren't in the URL
    const resolvedParams = await searchParams;
    const fromDate = resolvedParams.fromDate || dayjs().startOf('month').toISOString();
    const toDate = resolvedParams.toDate || dayjs().endOf('month').toISOString();
    const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

    // Fetch the sales report data from the API
    const initialReportData = await orderService.getSalesReport({
      fromDate,
      toDate,
      page,
      limit: 15,
    });

    // 4. Pass the server-fetched data as a prop to the Client Component
    return <ReportClient initialReportData={initialReportData} />;
  } catch (error) {
    console.error("Failed to fetch revenue report:", error);
    return <div>Error loading report data. Please try again.</div>;
  }
}
