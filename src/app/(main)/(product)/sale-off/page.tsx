import { notFound } from 'next/navigation';
// Import the correct, refactored service function
import { productService } from '@/services/productService';
import SaleOffClient from './SaleOffClient'; // Import the new Client Component

// Define the shape of the props Next.js will provide
interface SaleOffPageProps {
  searchParams: Promise<{
    page?: string;
    // You can add sort, brands, etc. here just like the category page
    sort?: string;
  }>;
}

// Add metadata for this specific page
export const metadata = {
    title: 'Sản phẩm khuyến mãi',
    description: 'Khám phá các sản phẩm cầu lông đang được giảm giá tại Bamito Shop.',
};

export const dynamic = 'force-dynamic';

export default async function SaleOffPage({ searchParams }: SaleOffPageProps) {
  // --- DATA FETCHING ON THE SERVER ---
  try {
    const resolvedParams = await searchParams;
    const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
    
    // Fetch the initial list of products that are on sale
    const saleProductData = await productService.getProductsOnSale({ page, limit: 12, sort: resolvedParams.sort });

    // Pass the server-fetched data as a prop to the Client Component
    return <SaleOffClient initialProductData={saleProductData} />;
  } catch (error) {
    console.error("Failed to fetch sale-off page data:", error);
    // In case of an API error, you can render an error state or a 404
    // For now, we'll just show an empty state by passing empty data.
    return <SaleOffClient initialProductData={{ items: [], totalItems: 0, totalPages: 1, currentPage: 1 }} />;
  }
}
