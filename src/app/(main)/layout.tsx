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
    // Fetch categories with a reasonable limit for navigation
    const response = await categoryService.getCategories({
      limit: 100, // Adjust this number based on your needs
      page: 1,
      // Add any other filter params if needed
    });
    
    // Extract the items array from the paginated response
    categories = response.items;
  } catch (error) {
    // Log the error but don't throw - we want the app to work even without categories
    console.error("Failed to fetch categories for header:", error);
    // You might want to add error reporting here
  }

  return (
    <UserLayout categories={categories}>
      {children}
    </UserLayout>
  );
}
