import { brandService } from '@/services/brandService';
import BrandClient from './BrandClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý Thương hiệu',
};

export const dynamic = 'force-dynamic';

interface AdminBrandsPageProps {
    searchParams: Promise<{ page?: string; name?: string }>;
}

export default async function AdminBrandsPage({ searchParams }: AdminBrandsPageProps) {
    // --- Data fetching on the server ---
    const resolvedParams = await searchParams;
    const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
    const name = resolvedParams.name || undefined;

    try {
        const initialBrandData = await brandService.getBrands({ page, name, limit: 10, pagination: true });
        
        // Pass the server-fetched data as a prop
        return <BrandClient initialBrandData={initialBrandData} />;
    } catch (error) {
        console.error("Failed to fetch brands:", error);
        return <div>Error loading brands. Please try again.</div>;
    }
}
