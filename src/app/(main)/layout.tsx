import { ReactNode } from 'react';
import UserLayout from "@/layout/userLayout/UserLayout";
import { PropsWithChildren } from 'react';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types/category';

interface MainLayoutProps extends PropsWithChildren {}

/**
 * Main layout component that wraps the main content of the application.
 * Fetches categories on the server side and passes them down to the UserLayout.
 */
export default async function MainLayout({ children }: MainLayoutProps) {
  let categories: Category[] = [];
  
  try {
    const response = await categoryService.getCategories({
      limit: 100,
      page: 1,
    });
    categories = response.items || [];
  } catch (error) {
    console.warn("Categories unavailable:", error instanceof Error ? error.message : 'Unknown error');
    categories = [];
  }

  return (
    <UserLayout categories={categories}>
      {children}
    </UserLayout>
  );
}
