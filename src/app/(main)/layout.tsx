import UserLayout from "@/layout/userLayout/UserLayout";
import { PropsWithChildren } from 'react';
// 1. Import the service to fetch categories
import { getAllCategoriesList } from '@/services/categoryService';

// This is now an async Server Component
export default async function MainLayout({ children }: PropsWithChildren) {
  // 2. Fetch the data on the server
  let categories = [];
  try {
    categories = await getAllCategoriesList();
  } catch (error) {
    console.error("Failed to fetch categories for header:", error);
    // Continue rendering even if categories fail to load
  }

  return (
    // 3. Pass the server-fetched data down to the UserLayout.
    // The UserLayout will then pass it to the Header.
    <UserLayout categories={categories}>
      {children}
    </UserLayout>
  );
}
