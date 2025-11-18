import { ReactNode } from 'react';
import UserLayout from "@/layout/userLayout/UserLayout";
import { categoryService } from '@/services/categoryService';

interface LayoutUserProps {
  children: ReactNode;
}

export default async function LayoutUser({ children }: LayoutUserProps) {
  // Use empty array for now to prevent API errors
  const categories: any[] = [];

  return (
    <UserLayout categories={categories}>
      {children}
    </UserLayout>
  );
}
