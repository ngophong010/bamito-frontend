import { getAllCategories } from '@/services/categoryService';
import CategoryClient from './CategoryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý Danh mục',
};

interface AdminCategoriesPageProps {
    searchParams: { page?: string; name?: string };
}

export default async function AdminCategoriesPage({ searchParams }: AdminCategoriesPageProps) {
    // --- Data fetching on the server ---
    try {
        const initialCategoryData = await getAllCategories({ 
            page: searchParams.page ? Number(searchParams.page) : 1,
            name: searchParams.name,
            limit: 10,
            pagination: true 
        });
        
        return <CategoryClient initialCategoryData={initialCategoryData} />;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return <div>Error loading categories. Please try again.</div>;
    }
}
