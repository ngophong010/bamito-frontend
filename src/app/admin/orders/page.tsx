import { Metadata } from 'next';

// 1. Import the correct, refactored service function
import { orderService } from '@/services/orderService';
import { OrderStatus } from '@/types/order';
import OrderListClient from './OrderListClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Quản lý Đơn hàng',
};

// 2. Define the shape of the props Next.js will provide (searchParams for filters)
interface AdminOrdersPageProps {
  searchParams: {
    page?: string;
    status?: string;
    // You could add more filters here, like 'search' by orderId or userName
  };
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  // --- 3. DATA FETCHING ON THE SERVER ---
  try {
    const page = searchParams.page ? Number(searchParams.page) : 1;
    const status = searchParams.status ? [Number(searchParams.status) as OrderStatus] : undefined;

    // Fetch the initial list of orders based on the URL query params
    const initialOrderData = await orderService.getOrderSummaries({
      page,
      status,
      limit: 15, // Set a default limit for the admin list
    });

    // 4. Pass the server-fetched data as a prop to the Client Component
    return <OrderListClient initialOrderData={initialOrderData} />;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return <div>Error loading orders. Please try again.</div>;
  }
}
