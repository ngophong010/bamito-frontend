import { Metadata } from 'next';

import { userService } from '@/services/userService';
import UserListClient from './UserListClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Quản lý Người dùng',
};

export const dynamic = 'force-dynamic';

interface AdminUsersPageProps {
  searchParams: Promise<{
    page?: string;
    name?: string; // For searching by user name
  }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  try {
    const resolvedParams = await searchParams;
    const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
    const name = resolvedParams.name || undefined;

    // Fetch the initial list of users on the server
    const initialUserData = await userService.getUsers({
      page,
      limit: 15,
    });

    return <UserListClient initialUserData={initialUserData} />;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return <div>Error loading users. Please try again.</div>;
  }
}
