import { categoryService } from '@/services/categoryService';
import CategoryClient from './CategoryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý Danh mục',
};

export const dynamic = 'force-dynamic';

interface AdminCategoriesPageProps {
    searchParams: Promise<{ page?: string; name?: string }>;
}

export default async function AdminCategoriesPage({ searchParams }: AdminCategoriesPageProps) {
    // --- Data fetching on the server ---
    try {
        const resolvedParams = await searchParams;
        const initialCategoryData = await categoryService.getCategories({ 
            page: resolvedParams.page ? Number(resolvedParams.page) : 1,
            limit: 10,
        });
        
        return <CategoryClient initialCategoryData={initialCategoryData} />;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return <div>Error loading categories. Please try again.</div>;
    }
}
