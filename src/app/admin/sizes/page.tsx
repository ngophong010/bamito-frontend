import { Metadata } from 'next';

// 1. Import the correct, refactored service function
import { sizeService } from '@/services/sizeService';
import SizeClient from './SizeClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Quản lý Kích thước',
};

export const dynamic = 'force-dynamic';

// 2. Define the shape of the props Next.js will provide
interface AdminSizesPageProps {
  searchParams: Promise<{
    page?: string;
    name?: string; // For searching by size name
  }>;
}

export default async function AdminSizesPage({ searchParams }: AdminSizesPageProps) {
  // --- 3. DATA FETCHING ON THE SERVER ---
  try {
    const resolvedParams = await searchParams;
    const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
    const name = resolvedParams.name || undefined;

    // Fetch the initial list of sizes based on the URL query params
    const initialSizeData = await sizeService.getAllSizes({
      page,
      name,
      limit: 15,
    });

    // 4. Pass the server-fetched data as a prop to the Client Component
    return <SizeClient initialSizeData={initialSizeData} />;
  } catch (error) {
    console.error("Failed to fetch sizes:", error);
    return <div>Error loading sizes. Please try again.</div>;
  }
}
