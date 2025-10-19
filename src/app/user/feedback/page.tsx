import { Metadata } from 'next';

// 1. Import the correct, refactored service function
import { feedbackService } from '@/services/feedbackService';
import FeedbackClient from './FeedbackClient'; // Import the new Client Component
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Đánh giá Sản phẩm',
    robots: { noindex: true, nofollow: true },
};

export default async function FeedbackPage() {
  // --- 2. DATA FETCHING ON THE SERVER ---
  try {
    // The getUnreviewedProducts service should be secure and automatically
    // use the user's session from the backend.
    const initialUnreviewedProducts = await feedbackService.getUnreviewedProducts();

    // 3. Pass the server-fetched data as a prop to the Client Component
    return <FeedbackClient initialProducts={initialUnreviewedProducts} />;
  } catch (error: any) {
    // If the service throws a 401 Unauthorized error, redirect to login
    if (error.response?.status === 401) {
        redirect('/login');
    }
    console.error("Failed to fetch unreviewed products:", error);
    return <div>Không thể tải sản phẩm cần đánh giá. Vui lòng thử lại.</div>;
  }
}
