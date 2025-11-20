import { Metadata } from 'next';
import { redirect } from 'next/navigation';

// 1. Import the correct, refactored service function
import { profileService } from '@/services/profileService'; // A dedicated service for profile actions
import ProfileClient from './ProfileClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Hồ sơ cá nhân',
    robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  // Create empty profile data as fallback
  const emptyProfileData = {
    user: {
      id: 0,
      email: '',
      firstName: '',
      lastName: '',
      userName: '',
      phone: '',
      phoneNumber: '',
      birthday: null,
      avatar: null,
      role: { id: 1, roleId: 'USER', roleName: 'User' }
    },
    favourites: [],
    orderCounts: 0
  };

  try {
    const userProfile = await profileService.getProfile();
    
    const initialProfileData = {
      user: userProfile,
      favourites: [],
      orderCounts: 0
    };

    return <ProfileClient initialProfileData={initialProfileData} />;
  } catch (error: any) {
    console.warn("Profile service unavailable, using empty profile:", error);
    // Return ProfileClient with empty data instead of error page
    return <ProfileClient initialProfileData={emptyProfileData} />;
  }
}
