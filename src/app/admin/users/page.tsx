import { Metadata } from 'next';

import { getAllUsers } from '@/services/userService';
import UserListClient from './UserListClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Quản lý Người dùng',
};

interface AdminUsersPageProps {
  searchParams: {
    page?: string;
    name?: string; // For searching by user name
  };
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  try {
    const page = searchParams.page ? Number(searchParams.page) : 1;
    const name = searchParams.name || undefined;

    // Fetch the initial list of users on the server
    const initialUserData = await getAllUsers({
      page,
      name,
      limit: 15,
    });

    return <UserListClient initialUserData={initialUserData} />;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return <div>Error loading users. Please try again.</div>;
  }
}
