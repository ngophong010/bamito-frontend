import { brandService } from '@/services/brandService';
import BrandClient from './BrandClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý Thương hiệu',
};

interface AdminBrandsPageProps {
    searchParams: { page?: string; name?: string };
}

export default async function AdminBrandsPage({ searchParams }: AdminBrandsPageProps) {
    // --- Data fetching on the server ---
    const page = searchParams.page ? Number(searchParams.page) : 1;
    const name = searchParams.name || undefined;

    try {
        const initialBrandData = await brandService.getBrands({ page, name, limit: 10, pagination: true });
        
        // Pass the server-fetched data as a prop
        return <BrandClient initialBrandData={initialBrandData} />;
    } catch (error) {
        console.error("Failed to fetch brands:", error);
        return <div>Error loading brands. Please try again.</div>;
    }
}
