import { ReactNode } from 'react';
import UserLayout from "@/layout/userLayout/UserLayout";
import { categoryService } from '@/services/categoryService';

interface LayoutUserProps {
  children: ReactNode;
}

export default async function LayoutUser({ children }: LayoutUserProps) {
  // Fetch categories on server side
  const categories = await categoryService.getAllCategoriesList();

  return (
    <UserLayout categories={categories}>
      {children}
    </UserLayout>
  );
}
