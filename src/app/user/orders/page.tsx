import { Metadata } from 'next';
// 1. Import the correct, refactored service function
import { getMyOrders } from '@/services/profileOrderService';
import OrderListClient from './OrderListClient'; // Import the new Client Component
import { redirect } from 'next/navigation';
export const metadata: Metadata = {
  title: 'Lịch sử Đơn hàng',
  robots: { index: false, follow: false },
};
// 2. Define the shape of the props Next.js will provide
interface MyOrdersPageProps {
  searchParams: {
    page?: string;
    status?: string; // e.g., ?status=1
  };
}
export default async function MyOrdersPage({ searchParams }: MyOrdersPageProps) {
  // --- 3. DATA FETCHING ON THE SERVER ---
  try {
    const page = searchParams.page ? Number(searchParams.page) : 1;
    const status = searchParams.status ? Number(searchParams.status) : 1; // Default to "Pending"

    // Fetch the user's orders based on the URL query params
    const initialOrderData = await getMyOrders({
      page,
      status,
      limit: 10,
    });

    // 4. Pass the server-fetched data as a prop to the Client Component
    return <OrderListClient initialOrderData={initialOrderData} />;

  } catch (error: any) {
    if (error.response?.status === 401) {
      redirect('/login');
    }
    console.error("Failed to fetch user orders:", error);
    return <div>Không thể tải lịch sử đơn hàng. Vui lòng thử lại.</div>;
  }
}
