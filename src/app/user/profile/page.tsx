import { Metadata } from 'next';
import { redirect } from 'next/navigation';

// 1. Import the correct, refactored service function
import { getProfile } from '@/services/profileService'; // A dedicated service for profile actions
import ProfileClient from './ProfileClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Hồ sơ cá nhân',
    robots: { noindex: true, nofollow: true },
};

export default async function ProfilePage() {
  // --- 2. DATA FETCHING ON THE SERVER ---
  try {
    // The getProfile service is secure and gets the user ID from the backend session
    const initialProfileData = await getProfile();

    // 3. Pass the server-fetched data as a prop to the Client Component
    return <ProfileClient initialProfileData={initialProfileData} />;
  } catch (error: any) {
    if (error.response?.status === 401) {
        redirect('/login');
    }
    console.error("Failed to fetch profile:", error);
    return <div>Không thể tải thông tin hồ sơ. Vui lòng thử lại.</div>;
  }
}
