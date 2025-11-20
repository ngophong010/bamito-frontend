import { notFound } from 'next/navigation';
// Import the correct, refactored service functions
import { productService } from '@/services/productService';
import SearchClient from './SearchClient'; // Import the new Client Component
import { Metadata } from 'next';
// Define the shape of the props Next.js will provide
interface SearchPageProps {
  searchParams: Promise<{
    q?: string; // The search query, e.g., ?q=yonex
    page?: string;
    sort?: string;
  }>;
}
// Dynamically generate metadata based on the search query
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams.q || '';
  return {
    title: searchTerm ? `Kết quả cho "${searchTerm}"`: 'Tìm kiếm sản phẩm',
    description: `Tìm kiếm và mua sắm các sản phẩm cầu lông chất lượng cao tại Bamito Shop.Kết quả cho: ${ searchTerm }`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // --- DATA FETCHING ON THE SERVER ---
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams.q || '';
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
  // If there's no search term, we can show a prompt or just an empty result set.
  if (!searchTerm) {
    return (
      <SearchClient
        initialProductData={{ items: [], totalItems: 0, totalPages: 1, currentPage: 1 }}
        searchTerm={searchTerm}
      />
    );
  }
  try {
    // Fetch the search results from the API
    const productData = await productService.getAllProducts({
      name: searchTerm,
      page,
      limit: 12,
      sort: resolvedParams.sort
    });

    // Pass the server-fetched data as a prop to the Client Component
    return <SearchClient initialProductData={productData} searchTerm={searchTerm} />;
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    // Render the client with empty data in case of an error
    return <SearchClient initialProductData={{ items: [], totalItems: 0, totalPages: 1, currentPage: 1 }} searchTerm={searchTerm} />;
  }
}
