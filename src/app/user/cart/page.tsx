import { Metadata } from 'next';
// 1. Import the correct, refactored service functions
import { cartService } from '@/services/cartService';
import { getProfile } from '@/services/authService'; // To get addresses
import { voucherService } from '@/services/voucherService';
import CartClient from './CartClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Giỏ hàng của bạn',
    robots: { noindex: true, nofollow: true }, // Don't index personal cart pages
};

export default async function CartPage() {
  // --- 2. DATA FETCHING ON THE SERVER ---
  // Fetch all necessary data in parallel for the initial page load.
  try {
    const [cartData, profileData, activeVouchers] = await Promise.all([
        cartService.getCart(),
        getProfile(),
        voucherService.getActiveVouchers(),
    ]);
    
    // 3. Pass the server-fetched data as props to the Client Component
    return (
        <CartClient 
            initialCartData={cartData}
            initialProfileData={profileData}
            activeVouchers={activeVouchers}
        />
    );
  } catch (error) {
    console.error("Failed to load cart page data:", error);
    // Render an error state or redirect
    return <div>Không thể tải giỏ hàng. Vui lòng thử lại.</div>;
  }
}
