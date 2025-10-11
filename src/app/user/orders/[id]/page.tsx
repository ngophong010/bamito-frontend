import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

// 1. Import the correct, refactored service function
import { getMyOrderDetails } from '@/services/profileOrderService';
import OrderDetailClient from './OrderDetailClient'; // Import the new Client Component

interface MyOrderDetailPageProps {
  params: {
    id: string; // The numeric primary key of the order
  };
}

// 2. Dynamically generate metadata for the page
export async function generateMetadata({ params }: MyOrderDetailPageProps): Promise<Metadata> {
    try {
        const order = await getMyOrderDetails(Number(params.id));
        return {
            title: `Chi tiết Đơn hàng #${order.orderId}`,
            robots: { noindex: true, nofollow: true },
        };
    } catch (error) {
        return { title: 'Không tìm thấy Đơn hàng' };
    }
}

export default async function MyOrderDetailPage({ params }: MyOrderDetailPageProps) {
  const orderId = Number(params.id);

  if (isNaN(orderId)) {
    notFound();
  }

  // --- 3. DATA FETCHING ON THE SERVER ---
  try {
    // The service is secure and automatically gets the user from the session
    const orderData = await getMyOrderDetails(orderId);
    
    // 4. Pass the server-fetched data as a prop to the Client Component
    return <OrderDetailClient order={orderData} />;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
        // If the user is not logged in or doesn't own this order, redirect
        redirect('/login');
    }
    console.error(`Failed to fetch order details for ID ${orderId}:`, error);
    notFound();
  }
}
